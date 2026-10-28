import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Gamepad2, TrendingUp, Tv, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CHART_COLORS = [
  '#34d399',
  '#22d3ee',
  '#a78bfa',
  '#f472b6',
  '#fbbf24',
  '#fb7185',
  '#60a5fa',
  '#4ade80',
];

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const emptyStats = {
  totalConsoles: 0,
  totalGames: 0,
  totalSpent: 0,
  totalEstimatedValue: 0,
  gamesByConsole: [],
  gamesByGenre: [],
};

const StatCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-slate-700 bg-slate-800 p-5">
    <div className="mb-4 h-10 w-10 rounded-lg bg-slate-700" />
    <div className="mb-2 h-4 w-24 rounded bg-slate-700" />
    <div className="h-8 w-32 rounded bg-slate-700" />
  </div>
);

const ChartSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-slate-700 bg-slate-800 p-5">
    <div className="mb-4 h-5 w-48 rounded bg-slate-700" />
    <div className="h-64 rounded-lg bg-slate-700/60" />
  </div>
);

const StatCard = ({ title, value, subtitle, icon: Icon, accent }) => (
  <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
    <div className="mb-4 flex items-center justify-between">
      <div className={`rounded-lg p-2.5 ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    <p className="mb-1 text-sm text-slate-400">{title}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
    {subtitle && <p className="mt-2 text-xs text-slate-400">{subtitle}</p>}
  </div>
);

const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#e2e8f0',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch {
        setError('Erro ao carregar estatísticas do dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const appreciation = (stats.totalEstimatedValue || 0) - (stats.totalSpent || 0);
  const appreciationPositive = appreciation >= 0;

  const gamesByConsole = (stats.gamesByConsole || []).filter((item) => item.value > 0);
  const gamesByGenre = stats.gamesByGenre || [];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Olá, {user?.name}. Visão geral da sua coleção.
          </p>
        </div>

        {error && (
          <p className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total de Consoles"
                value={stats.totalConsoles}
                icon={Tv}
                accent="bg-emerald-500/20 text-emerald-400"
              />
              <StatCard
                title="Total de Jogos"
                value={stats.totalGames}
                icon={Gamepad2}
                accent="bg-cyan-500/20"
              />
              <StatCard
                title="Valor Investido"
                value={formatCurrency(stats.totalSpent)}
                icon={Wallet}
                accent="bg-violet-500/20"
              />
              <StatCard
                title="Valor Estimado"
                value={formatCurrency(stats.totalEstimatedValue)}
                subtitle={
                  <span
                    className={
                      appreciationPositive ? 'text-emerald-400' : 'text-rose-400'
                    }
                  >
                    <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                    Valorização: {formatCurrency(appreciation)}
                  </span>
                }
                icon={TrendingUp}
                accent="bg-amber-500/20"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Jogos por Console
                </h2>
                {gamesByConsole.length === 0 ? (
                  <p className="flex h-64 items-center justify-center text-sm text-slate-400">
                    Sem dados para exibir
                  </p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gamesByConsole}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={95}
                          paddingAngle={3}
                        >
                          {gamesByConsole.map((entry, index) => (
                            <Cell
                              key={`${entry.name}-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend
                          wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Jogos por Gênero
                </h2>
                {gamesByGenre.length === 0 ? (
                  <p className="flex h-64 items-center justify-center text-sm text-slate-400">
                    Sem dados para exibir
                  </p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gamesByGenre}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <YAxis
                          allowDecimals={false}
                          stroke="#94a3b8"
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: '#1e293b' }}
                          contentStyle={tooltipStyle}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {gamesByGenre.map((entry, index) => (
                            <Cell
                              key={`${entry.name}-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
