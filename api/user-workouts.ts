import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function getUserId(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: "Não autenticado" });

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("user_workouts")
      .select(
        `
      *,
      library_workouts(
        *,
        workout_exercises(*, exercise_catalog(*))
      )
    `,
      )
      .eq("user_id", userId)
      .order("position");

    if (error) return res.status(500).json({ error: error.message });

    // busca todas as customizações desse usuário de uma vez (mais eficiente que 1 query por exercício)
    const { data: overrides } = await supabaseAdmin
      .from("user_workout_exercises")
      .select("*")
      .eq("user_id", userId);

    const overrideMap = new Map(
      (overrides ?? []).map((o) => [o.workout_exercise_id, o]),
    );

    const formatted = data.map((uw: any) => ({
      userWorkoutId: uw.id,
      isFavorite: uw.is_favorite,
      isActive: uw.is_active,
      workout: {
        id: uw.library_workouts.id,
        title: uw.library_workouts.title,
        type: uw.library_workouts.type,
        exercises: uw.library_workouts.workout_exercises
          .sort((a: any, b: any) => a.position - b.position)
          .map((we: any) => {
            const override = overrideMap.get(we.id);
            return {
              id: we.exercise_catalog.id,
              workoutExerciseId: we.id, // necessário pra saber o que customizar depois
              name: we.exercise_catalog.name,
              muscleGroup: we.exercise_catalog.muscle_group,
              type: we.exercise_catalog.type,
              // override tem prioridade; se não existir, usa o template
              sets: override?.sets ?? we.sets,
              reps: override?.reps ?? we.reps,
              rest: override?.rest ?? we.rest,
              load: override?.load ?? we.load,
              details: override?.details ?? we.details,
              manualSetSeconds: override?.manual_set_seconds ?? undefined,
              calibratedSetTimes: override?.calibrated_set_times ?? undefined,
            };
          }),
      },
    }));

    return res.status(200).json(formatted);
  }

  if (req.method === "POST") {
    const { workoutId, isFavorite = false } = req.body;
    const { data, error } = await supabaseAdmin
      .from("user_workouts")
      .upsert(
        { user_id: userId, workout_id: workoutId, is_favorite: isFavorite },
        { onConflict: "user_id,workout_id" },
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PATCH") {
    const { userWorkoutId, isFavorite, isActive } = req.body;
    const updateFields: Record<string, boolean> = {};
    if (isFavorite !== undefined) updateFields.is_favorite = isFavorite;
    if (isActive !== undefined) updateFields.is_active = isActive;

    const { data, error } = await supabaseAdmin
      .from("user_workouts")
      .update(updateFields)
      .eq("id", userWorkoutId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { userWorkoutId } = req.body;
    const { error } = await supabaseAdmin
      .from("user_workouts")
      .delete()
      .eq("id", userWorkoutId)
      .eq("user_id", userId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  if (req.method === "PUT") {
    // body: { order: [userWorkoutId1, userWorkoutId2, ...] } — na nova ordem desejada
    const { order } = req.body;

    const updates = order.map((userWorkoutId: string, index: number) =>
      supabaseAdmin
        .from("user_workouts")
        .update({ position: index })
        .eq("id", userWorkoutId)
        .eq("user_id", userId),
    );

    await Promise.all(updates);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
