// adiciona esse bloco dentro do handler, como um novo "sub-método" via query param
// ou cria um arquivo separado: api/create-own-workout.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUserId(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Não autenticado' });

  if (req.method === 'POST') {
    const { title, type, exercises } = req.body;

    // 1. Cria o library_workouts (autor = o próprio usuário)
    const { data: workout, error: wError } = await supabaseAdmin
      .from('library_workouts')
      .insert({ author_id: userId, title, type })
      .select()
      .single();

    if (wError) return res.status(500).json({ error: wError.message });

    // 2. Garante que cada exercício existe no catálogo (ou cria)
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];

      let { data: catalogItem } = await supabaseAdmin
        .from('exercise_catalog')
        .select('id')
        .eq('name', ex.name)
        .maybeSingle();

      if (!catalogItem) {
        const { data: newCatalogItem, error: cError } = await supabaseAdmin
          .from('exercise_catalog')
          .insert({
            name: ex.name,
            muscle_group: ex.muscleGroup,
            type: ex.type,
            created_by: userId,
          })
          .select('id')
          .single();
        if (cError) return res.status(500).json({ error: cError.message });
        catalogItem = newCatalogItem;
      }

      // 3. Cria a referência workout_exercises
      const { error: weError } = await supabaseAdmin.from('workout_exercises').insert({
        workout_id: workout.id,
        exercise_id: catalogItem.id,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        load: ex.load,
        details: ex.details,
        position: i,
      });
      if (weError) return res.status(500).json({ error: weError.message });
    }

    // 4. Vincula esse treino ao usuário em user_workouts
    const { data: userWorkout, error: uwError } = await supabaseAdmin
      .from('user_workouts')
      .insert({ user_id: userId, workout_id: workout.id })
      .select()
      .single();

    if (uwError) return res.status(500).json({ error: uwError.message });

    return res.status(201).json({ workoutId: workout.id, userWorkoutId: userWorkout.id });
  }

  // PATCH: atualizar exercícios de um treino já existente (usado na edição)
  if (req.method === 'PATCH') {
    const { workoutId, title, type, exercises } = req.body;

    const { error: wError } = await supabaseAdmin
      .from('library_workouts')
      .update({ title, type })
      .eq('id', workoutId)
      .eq('author_id', userId);
    if (wError) return res.status(500).json({ error: wError.message });

    // Remove exercícios antigos e reinsere (mais simples que diff incremental)
    await supabaseAdmin.from('workout_exercises').delete().eq('workout_id', workoutId);

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      let { data: catalogItem } = await supabaseAdmin
        .from('exercise_catalog')
        .select('id')
        .eq('name', ex.name)
        .maybeSingle();

      if (!catalogItem) {
        const { data: newCatalogItem } = await supabaseAdmin
          .from('exercise_catalog')
          .insert({ name: ex.name, muscle_group: ex.muscleGroup, type: ex.type, created_by: userId })
          .select('id')
          .single();
        catalogItem = newCatalogItem;
      }

      await supabaseAdmin.from('workout_exercises').insert({
        workout_id: workoutId,
        exercise_id: catalogItem!.id,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        load: ex.load,
        details: ex.details,
        position: i,
      });
    }

    return res.status(200).json({ workoutId });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}