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
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const userId = await getUserId(req);
  if (!userId) return res.status(401).json({ error: "Não autenticado" });

  if (req.method === "POST") {
    const {
      workoutExerciseId,
      sets,
      reps,
      rest,
      load,
      details,
      manualSetSeconds,
      calibratedSetTimes,
    } = req.body;

    const { data, error } = await supabaseAdmin
      .from("user_workout_exercises")
      .upsert(
        {
          user_id: userId,
          workout_exercise_id: workoutExerciseId,
          sets,
          reps,
          rest,
          load,
          details,
          manual_set_seconds: manualSetSeconds,
          calibrated_set_times: calibratedSetTimes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,workout_exercise_id" },
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
