// src/components/UserMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SettingsModal } from './SettingsModal';
import { ROLE_LABELS } from '../types/user';
import type { UserRole } from '../types/user';

const ROLES: UserRole[] = ['aluno', 'personal_trainer', 'admin'];

export function UserMenu() {
  const { session, profile, signInWithGoogle, signOut, updateRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); // ← novo
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-3 h-10 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <GoogleIcon />
        Entrar
      </button>
    );
  }

  const showImage = profile?.avatar_url && !imgError;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(p => !p)}
        className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-100 dark:bg-gray-800 shrink-0"
      >
        {showImage ? (
          <img
            src={profile.avatar_url!}
            alt={profile.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {profile?.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setOpen(false)} />

          <div className="
            fixed sm:absolute
            left-4 right-4 sm:left-auto sm:right-0
            top-16 sm:top-12
            sm:w-64
            bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800
            shadow-lg p-4 z-50 flex flex-col gap-4
            max-h-[80vh] overflow-y-auto
          ">
            <div className="flex items-center gap-3">
              {showImage ? (
                <img
                  src={profile.avatar_url!}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {profile?.name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{profile?.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{session.user.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-gray-400 dark:text-gray-500">Seu papel</span>
              <div className="flex gap-1.5 flex-wrap">
                {ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => updateRole(role)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      profile?.role === role
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de configurações — novo */}
            <button
              onClick={() => { setSettingsOpen(true); setOpen(false); }}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors text-left flex items-center gap-2"
            >
              <GearIcon />
              Configurações
            </button>

            <button
              onClick={signOut}
              className="text-sm text-red-500 hover:text-red-600 transition-colors text-left"
            >
              Sair
            </button>
          </div>
        </>
      )}

      {/* Modal de configurações — novo */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}