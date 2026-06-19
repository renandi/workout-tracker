import { useAuth } from '../hooks/useAuth';
import { ROLE_LABELS } from '../types/user';
import type { UserRole } from '../types/user';

const ROLES: UserRole[] = ['aluno', 'personal_trainer', 'admin'];

export function RoleSelector() {
  const { profile, updateRole } = useAuth();
  if (!profile) return null;

  return (
    <div className="flex gap-2">
      {ROLES.map(role => (
        <button
          key={role}
          onClick={() => updateRole(role)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            profile.role === role
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {ROLE_LABELS[role]}
        </button>
      ))}
    </div>
  );
}