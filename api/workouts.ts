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
      .select(
        "*, workout_exercises(*, exercise_catalog(*)), profiles(name, avatar_url)",
      )
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const formatted = workouts.map((w) => ({
      id: w.id,
      title: w.title,
      type: w.type,
      description: w.description,
      author: w.profiles?.name ?? "Desconhecido",
      authorAvatar: w.profiles?.avatar_url ?? null,
      exercises: w.workout_exercises
        .sort((a: any, b: any) => a.position - b.position)
        .map((we: any) => ({
          id: we.exercise_catalog.id,
          name: we.exercise_catalog.name,
          muscleGroup: we.exercise_catalog.muscle_group,
          type: we.exercise_catalog.type,
          executionTip: we.exercise_catalog.execution_tip,
          sets: we.sets,
          reps: we.reps,
          rest: we.rest,
          load: we.load,
          details: we.details,
        })),
    }));

    return res.status(200).json(formatted);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
