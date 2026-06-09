import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = join('/tmp', 'workouts.json');

const SEED = [
  {
    id: randomUUID(),
    title: 'Peito e Tríceps',
    type: 'Força',
    description: 'Foco em hipertrofia de peitoral e tríceps com compostos e isoladores.',
    author: 'Ficha',
    exercises: [
      { id: randomUUID(), name: 'Supino Reto', type: 'reps', sets: 4, reps: '6-9', rest: 90, load: null },
      { id: randomUUID(), name: 'Supino Inclinado', type: 'reps', sets: 3, reps: '8-10', rest: 75, load: null },
      { id: randomUUID(), name: 'Cross Over', type: 'reps', sets: 3, reps: '10-12', rest: 60, load: null },
      { id: randomUUID(), name: 'Tríceps Francês', type: 'reps', sets: 3, reps: '8-10', rest: 60, load: null },
      { id: randomUUID(), name: 'Tríceps Corda', type: 'reps', sets: 3, reps: '10-12', rest: 60, load: null, details: 'DROP' },
    ],
  },
  {
    id: randomUUID(),
    title: 'Costas e Bíceps',
    type: 'Força',
    description: 'Treino de puxada com ênfase em largura e espessura das costas.',
    author: 'Ficha',
    exercises: [
      { id: randomUUID(), name: 'Barra Fixa', type: 'reps', sets: 3, reps: 'X', rest: 90, load: null },
      { id: randomUUID(), name: 'Remada Baixa', type: 'reps', sets: 4, reps: '6-9', rest: 75, load: null },
      { id: randomUUID(), name: 'Puxada Frente', type: 'reps', sets: 3, reps: '8-10', rest: 60, load: null },
      { id: randomUUID(), name: 'Rosca Direta', type: 'reps', sets: 3, reps: '8-10', rest: 60, load: null },
      { id: randomUUID(), name: 'Rosca Martelo', type: 'reps', sets: 3, reps: '10-12', rest: 60, load: null },
    ],
  },
  {
    id: randomUUID(),
    title: 'Pernas — Quad e Glúteo',
    type: 'Força',
    description: 'Foco em quadríceps e glúteos com agachamento e leg press.',
    author: 'Ficha',
    exercises: [
      { id: randomUUID(), name: 'Agachamento Livre', type: 'reps', sets: 4, reps: '6-9', rest: 120, load: null, details: 'AQ+6-9' },
      { id: randomUUID(), name: 'Leg Press', type: 'reps', sets: 4, reps: '8-10', rest: 90, load: null, details: 'REST PAUSE' },
      { id: randomUUID(), name: 'Cadeira Extensora', type: 'reps', sets: 3, reps: '10-12', rest: 60, load: null },
      { id: randomUUID(), name: 'Passada c/ Halter', type: 'reps', sets: 3, reps: '16-20', rest: 60, load: null },
      { id: randomUUID(), name: 'Panturrilha Sentado', type: 'reps', sets: 4, reps: '8-10', rest: 45, load: null },
    ],
  },
  {
    id: randomUUID(),
    title: 'Pernas — Posterior',
    type: 'Força',
    description: 'Ênfase em isquiotibiais, glúteos e panturrilha.',
    author: 'Ficha',
    exercises: [
      { id: randomUUID(), name: 'Cadeira Flexora', type: 'reps', sets: 4, reps: '6-9', rest: 75, load: null },
      { id: randomUUID(), name: 'Stiff', type: 'reps', sets: 3, reps: '8-10', rest: 75, load: null },
      { id: randomUUID(), name: 'Flexão Nórdica', type: 'reps', sets: 3, reps: 'X', rest: 90, load: null },
      { id: randomUUID(), name: 'Flexor Deitado', type: 'reps', sets: 3, reps: '10-12', rest: 60, load: null },
      { id: randomUUID(), name: 'Prancha Isométrica', type: 'tempo', sets: 3, reps: '60', rest: 60, load: null, details: '1min' },
    ],
  },
  {
    id: randomUUID(),
    title: 'Ombros e Trapézio',
    type: 'Força',
    description: 'Desenvolvimento de ombros com isoladores e trabalho de trapézio.',
    author: 'Ficha',
    exercises: [
      { id: randomUUID(), name: 'Desenvolvimento Máquina', type: 'reps', sets: 4, reps: '6-9', rest: 90, load: null },
      { id: randomUUID(), name: 'Elevação Lateral', type: 'reps', sets: 4, reps: '10-12', rest: 60, load: null },
      { id: randomUUID(), name: 'Elevação Frontal', type: 'reps', sets: 3, reps: '10-12', rest: 60, load: null },
      { id: randomUUID(), name: 'Crucifixo Inverso', type: 'reps', sets: 3, reps: '10-12', rest: 60, load: null },
      { id: randomUUID(), name: 'Encolhimento de Ombro', type: 'reps', sets: 4, reps: '8-10', rest: 60, load: null },
    ],
  },
  {
    id: randomUUID(),
    title: 'HIIT 20min',
    type: 'HIIT',
    description: 'Circuito de alta intensidade sem equipamento. 20 segundos de esforço, 10 de descanso.',
    author: 'Ficha',
    exercises: [
      { id: randomUUID(), name: 'Burpee', type: 'tempo', sets: 4, reps: '20', rest: 10, load: null },
      { id: randomUUID(), name: 'Mountain Climber', type: 'tempo', sets: 4, reps: '20', rest: 10, load: null },
      { id: randomUUID(), name: 'Jump Squat', type: 'tempo', sets: 4, reps: '20', rest: 10, load: null },
      { id: randomUUID(), name: 'Polichinelo', type: 'tempo', sets: 4, reps: '20', rest: 10, load: null },
      { id: randomUUID(), name: 'Sprint Estacionário', type: 'tempo', sets: 4, reps: '20', rest: 10, load: null },
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
    const workouts = readDb();
    const newWorkout = { ...req.body, id: randomUUID() };
    workouts.push(newWorkout);
    writeDb(workouts);
    return res.status(201).json(newWorkout);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}