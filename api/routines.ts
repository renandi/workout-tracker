import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = join('/tmp', 'routines.json');

function readDb() {
  if (!existsSync(DB_PATH)) return [];
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(data: unknown) {
  writeFileSync(DB_PATH, JSON.stringify(data));
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json(readDb());
  }

  if (req.method === 'POST') {
    const routines = readDb();
    const newRoutine = { ...req.body, id: randomUUID() };
    routines.push(newRoutine);
    writeDb(routines);
    return res.status(201).json(newRoutine);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}