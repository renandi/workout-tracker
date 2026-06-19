// api/exercises.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('library_exercises')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // adapta snake_case do banco pro camelCase que o frontend espera
    const formatted = data.map(ex => ({
      id: ex.id,
      name: ex.name,
      type: ex.type,
      muscleGroup: ex.muscle_group,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.rest,
      load: ex.load,
      details: ex.details,
      author: ex.author_id,
    }));

    return res.status(200).json(formatted);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}