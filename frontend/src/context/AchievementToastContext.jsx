import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Gamepad2, Trophy, Tv } from 'lucide-react';
import { playAchievementSound } from '../utils/achievementSound';

const AchievementToastContext = createContext(null);

const ICONS = {
  Tv,
  Gamepad2,
  Trophy,
};

export const AchievementToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const notifyAchievements = useCallback(
    async (achievements = []) => {
      const list = Array.isArray(achievements)
        ? achievements.filter(Boolean)
        : [];

      if (!list.length) return;

      await playAchievementSound();

      list.forEach((achievement, index) => {
        const id = `${achievement.code || achievement.id || 'ach'}-${Date.now()}-${index}`;

        setTimeout(() => {
          setToasts((prev) => [
            ...prev,
            {
              id,
              title: achievement.title || 'Conquista desbloqueada',
              description: achievement.description || '',
              icon: achievement.icon || 'Trophy',
            },
          ]);

          setTimeout(() => dismissToast(id), 5200);
        }, index * 650);
      });
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ notifyAchievements }),
    [notifyAchievements]
  );

  return (
    <AchievementToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100vw-2rem,22rem)] flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.icon] || Trophy;

          return (
            <div
              key={toast.id}
              className="pointer-events-auto animate-[slideInRight_0.35s_ease-out] overflow-hidden rounded-xl border border-amber-400/50 bg-slate-950/95 shadow-[0_0_30px_rgba(245,158,11,0.35)] backdrop-blur"
            >
              <div className="flex items-stretch">
                <div className="flex w-16 items-center justify-center bg-gradient-to-b from-amber-400 to-amber-600">
                  <Icon className="h-7 w-7 text-slate-950" />
                </div>
                <div className="flex-1 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                    Conquista desbloqueada
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {toast.title}
                  </p>
                  {toast.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(120%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </AchievementToastContext.Provider>
  );
};

export const useAchievementToast = () => {
  const context = useContext(AchievementToastContext);
  if (!context) {
    throw new Error('useAchievementToast must be used within AchievementToastProvider');
  }
  return context;
};
