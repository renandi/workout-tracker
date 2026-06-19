import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { data: workouts, error } = await supabase
      .from("library_workouts")
      .select("*, library_workout_exercises(*), profiles(name, avatar_url)")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const formatted = workouts.map((w) => ({
      id: w.id,
      title: w.title,
      type: w.type,
      description: w.description,
      author: w.profiles?.name ?? "Desconhecido", // ← nome em vez do UUID
      authorAvatar: w.profiles?.avatar_url ?? null,
      exercises: w.library_workout_exercises
        .sort((a: any, b: any) => a.position - b.position)
        .map((ex: any) => ({
          id: ex.id,
          name: ex.name,
          type: ex.type,
          muscleGroup: ex.muscle_group,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          load: ex.load,
          details: ex.details,
        })),
    }));

    return res.status(200).json(formatted);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
