import { useCallback, useEffect, useMemo, useState } from 'react';
import { Save, Shield, Users as UsersIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ROLES, roleLabel } from '../constants/roles';
import api from '../services/api';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/users');
      setUsers(data);
      const nextDraft = {};
      data.forEach((item) => {
        nextDraft[item.id] = item.role === ROLES.SECONDARY_ADMIN;
      });
      setDraft(nextDraft);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const dirtyUsers = useMemo(
    () =>
      users.filter((item) => {
        if (item.role === ROLES.PRIMARY_ADMIN) return false;
        const checked = Boolean(draft[item.id]);
        const currentlySecondary = item.role === ROLES.SECONDARY_ADMIN;
        return checked !== currentlySecondary;
      }),
    [users, draft]
  );

  const handleToggle = (userId, checked) => {
    setDraft((prev) => ({ ...prev, [userId]: checked }));
    setMessage('');
  };

  const handleSave = async () => {
    if (!dirtyUsers.length || saving) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      for (const item of dirtyUsers) {
        await api.patch(`/users/${item.id}/role`, {
          isSecondaryAdmin: Boolean(draft[item.id]),
        });
      }

      await loadUsers();
      setMessage('Permissões atualizadas com sucesso');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar permissões');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-violet-500/20 p-3 text-violet-300">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Usuários</h1>
              <p className="text-sm text-slate-400">
                Adm principal: conceda ou remova poderes de administrador secundário
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || dirtyUsers.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
            {message}
          </p>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-4 py-3 text-xs uppercase tracking-wider text-slate-400">
            Logado como {currentUser?.email} · {roleLabel(currentUser?.role)}
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-lg bg-slate-800"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Papel atual</th>
                    <th className="px-4 py-3">Adm secundário</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => {
                    const isPrimary = item.role === ROLES.PRIMARY_ADMIN;

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-slate-800 hover:bg-slate-800/40"
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          <div className="flex items-center gap-2">
                            {isPrimary && (
                              <Shield className="h-4 w-4 text-amber-400" />
                            )}
                            {item.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{item.email}</td>
                        <td className="px-4 py-3 text-slate-300">
                          {roleLabel(item.role)}
                        </td>
                        <td className="px-4 py-3">
                          {isPrimary ? (
                            <span className="text-xs text-slate-500">
                              Fixo (adm principal)
                            </span>
                          ) : (
                            <label className="inline-flex items-center gap-2 text-slate-200">
                              <input
                                type="checkbox"
                                checked={Boolean(draft[item.id])}
                                onChange={(event) =>
                                  handleToggle(item.id, event.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                              />
                              Conceder
                            </label>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Users;
