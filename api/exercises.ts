import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';

const SEED = [
  { id: randomUUID(), name: 'Supino Reto', type: 'reps', muscleGroup: 'Peito', sets: 4, reps: '6-9', rest: 90, load: null },
  { id: randomUUID(), name: 'Agachamento Livre', type: 'reps', muscleGroup: 'Perna', sets: 4, reps: '6-9', rest: 120, load: null },
  { id: randomUUID(), name: 'Barra Fixa', type: 'reps', muscleGroup: 'Costas', sets: 3, reps: 'X', rest: 90, load: null },
  { id: randomUUID(), name: 'Desenvolvimento Máquina', type: 'reps', muscleGroup: 'Ombro', sets: 4, reps: '6-9', rest: 90, load: null },
  { id: randomUUID(), name: 'Rosca Direta', type: 'reps', muscleGroup: 'Bíceps', sets: 3, reps: '8-10', rest: 60, load: null },
  { id: randomUUID(), name: 'Tríceps Corda', type: 'reps', muscleGroup: 'Tríceps', sets: 3, reps: '10-12', rest: 60, load: null },
  { id: randomUUID(), name: 'Rosca Punho', type: 'reps', muscleGroup: 'Antebraço', sets: 3, reps: '12-15', rest: 45, load: null },
  { id: randomUUID(), name: 'Elevação Pélvica', type: 'reps', muscleGroup: 'Glúteo', sets: 4, reps: '10-12', rest: 75, load: null },
  { id: randomUUID(), name: 'Panturrilha em Pé', type: 'reps', muscleGroup: 'Panturrilha', sets: 4, reps: '12-15', rest: 45, load: null },
  { id: randomUUID(), name: 'Prancha Isométrica', type: 'tempo', muscleGroup: 'Abdômen', sets: 3, reps: '60', rest: 60, load: null },
  { id: randomUUID(), name: 'Burpee', type: 'tempo', muscleGroup: 'Cardio', sets: 4, reps: '30', rest: 15, load: null },
  { id: randomUUID(), name: 'Mountain Climber', type: 'tempo', muscleGroup: 'Corpo todo', sets: 4, reps: '30', rest: 15, load: null },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json(SEED);
  return res.status(405).json({ error: 'Method not allowed' });
}