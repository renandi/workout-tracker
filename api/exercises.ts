// api/exercises.ts
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
    const { data, error } = await supabase
      .from("exercise_catalog")
      .select("*")
      .order("name");

    if (error) return res.status(500).json({ error: error.message });

    const formatted = data.map((ex) => ({
      id: ex.id,
      name: ex.name,
      muscleGroup: ex.muscle_group,
      type: ex.type,
      executionTip: ex.execution_tip,
    }));

    return res.status(200).json(formatted);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
