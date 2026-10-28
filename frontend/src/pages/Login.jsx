import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-950 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:48px_48px]" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-emerald-950/40 backdrop-blur"
      >
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
            Coleção Retro
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white">
            SMA<span className="text-emerald-400">UG</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Entre para gerenciar sua coleção
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-950/60 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <label className="mb-4 block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Senha
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mb-5 w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-slate-400">
          Não tem conta?{' '}
          <Link
            to="/register"
            className="font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
