import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = join('/tmp', 'routines.json');

// IDs fixos no seed pra poder referenciar nos workoutIds
const SEED_WORKOUT_IDS = {
  peitoTriceps: 'seed-peito-triceps',
  costasBiceps: 'seed-costas-biceps',
  pernasQuad:   'seed-pernas-quad',
  pernasPosterior: 'seed-pernas-posterior',
  ombros:       'seed-ombros',
  hiit:         'seed-hiit',
};

const SEED = [
  {
    id: randomUUID(),
    name: 'Push Pull Legs 3x',
    description: 'Divisão clássica PPL para 3 dias na semana.',
    author: 'Ficha',
    workoutIds: [
      SEED_WORKOUT_IDS.peitoTriceps,
      SEED_WORKOUT_IDS.costasBiceps,
      SEED_WORKOUT_IDS.pernasQuad,
    ],
  },
  {
    id: randomUUID(),
    name: 'ABC 5 dias',
    description: 'Rotina completa cobrindo todos os grupos musculares em 5 dias.',
    author: 'Ficha',
    workoutIds: [
      SEED_WORKOUT_IDS.peitoTriceps,
      SEED_WORKOUT_IDS.costasBiceps,
      SEED_WORKOUT_IDS.pernasQuad,
      SEED_WORKOUT_IDS.pernasPosterior,
      SEED_WORKOUT_IDS.ombros,
    ],
  },
  {
    id: randomUUID(),
    name: 'Força + Cardio',
    description: 'Treino de força durante a semana com HIIT no fim de semana.',
    author: 'Ficha',
    workoutIds: [
      SEED_WORKOUT_IDS.pernasQuad,
      SEED_WORKOUT_IDS.peitoTriceps,
      SEED_WORKOUT_IDS.hiit,
    ],
  },
];

function readDb() {
  if (!existsSync(DB_PATH)) return SEED;
  const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  return data.length === 0 ? SEED : data;
}

function writeDb(data: unknown) {
  writeFileSync(DB_PATH, JSON.stringify(data));
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json(readDb());

  if (req.method === 'POST') {
    const routines = readDb();
    const newRoutine = { ...req.body, id: randomUUID() };
    routines.push(newRoutine);
    writeDb(routines);
    return res.status(201).json(newRoutine);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}