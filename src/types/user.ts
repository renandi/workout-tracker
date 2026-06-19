export type UserRole = 'aluno' | 'personal_trainer' | 'admin';

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  organization_id: string | null;
  group_id: string | null;
  created_at: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  aluno: 'Aluno',
  personal_trainer: 'Personal Trainer',
  admin: 'Admin',
};