import { useCallback, useEffect, useState } from 'react';
import { Gamepad2, Lock, Trophy, Tv } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAchievementToast } from '../context/AchievementToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ICONS = {
  Tv,
  Gamepad2,
  Trophy,
};

const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Achievements = () => {
  const { isAdmin } = useAuth();
  const { notifyAchievements } = useAchievementToast();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/achievements');
      setAchievements(data);
    } catch {
      setError('Erro ao carregar conquistas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const runAdminAction = async (action) => {
    setAdminLoading(true);
    setAdminMessage('');
    setError('');

    try {
      await action();
      await loadAchievements();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro na ação de admin');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleClear = () => {
    const confirmed = window.confirm('Limpar todas as suas conquistas desbloqueadas?');
    if (!confirmed) return;

    runAdminAction(async () => {
      const { data } = await api.delete('/achievements/unlocked');
      setAdminMessage(data.message);
    });
  };

  const handleGrantAll = () => {
    runAdminAction(async () => {
      const { data } = await api.post('/achievements/grant-all');
      await notifyAchievements(data.unlockedAchievements);
      setAdminMessage(data.message);
    });
  };

  const handleToggle = (item) => {
    runAdminAction(async () => {
      if (item.unlocked) {
        const { data } = await api.delete(`/achievements/unlocked/${item.code}`);
        setAdminMessage(data.message);
      } else {
        const { data } = await api.post('/achievements/grant', { code: item.code });
        await notifyAchievements(data.unlockedAchievements);
        setAdminMessage(data.message);
      }
    });
  };

  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Conquistas</h1>
            <p className="text-sm text-slate-400">
              {loading
                ? 'Carregando troféus...'
                : `${unlockedCount} de ${achievements.length} desbloqueadas`}
            </p>
          </div>
        </div>

        {isAdmin ? (
          <section className="mb-6 rounded-xl border border-amber-500/30 bg-slate-900 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Admin / Teste
                </h2>
                <p className="text-xs text-slate-400">
                  Limpe ou ative conquistas para validar a interface
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={adminLoading}
                  onClick={handleClear}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                >
                  Limpar todas
                </button>
                <button
                  type="button"
                  disabled={adminLoading}
                  onClick={handleGrantAll}
                  className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
                >
                  Ativar todas
                </button>
              </div>
            </div>
            {adminMessage && (
              <p className="text-sm text-amber-300">{adminMessage}</p>
            )}
          </section>
        ) : null}

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-xl border border-slate-700 bg-slate-800"
              />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center text-slate-400">
            Nenhuma conquista cadastrada.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item) => {
              const Icon = ICONS[item.icon] || Trophy;
              const unlocked = item.unlocked;

              return (
                <article
                  key={item.id}
                  className={`rounded-xl border bg-slate-900 p-5 transition ${
                    unlocked
                      ? 'border-amber-500 shadow-[0_0_24px_rgba(245,158,11,0.25)]'
                      : 'border-slate-700 opacity-50 grayscale'
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div
                      className={`rounded-lg p-3 ${
                        unlocked
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    {!unlocked && <Lock className="h-4 w-4 text-slate-500" />}
                  </div>

                  <h2 className="mb-1 text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mb-4 text-sm text-slate-400">{item.description}</p>

                  {unlocked ? (
                    <p className="mb-4 text-xs font-medium uppercase tracking-wide text-amber-400">
                      Desbloqueada em {formatDate(item.unlockedAt)}
                    </p>
                  ) : (
                    <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                      Bloqueada
                    </p>
                  )}

                  {isAdmin ? (
                    <button
                      type="button"
                      disabled={adminLoading}
                      onClick={() => handleToggle(item)}
                      className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                        unlocked
                          ? 'border border-slate-600 text-slate-300 hover:bg-slate-800'
                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      }`}
                    >
                      {unlocked ? 'Desativar (teste)' : 'Ativar (teste)'}
                    </button>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Achievements;
