import { NavLink, useNavigate } from 'react-router-dom';
import { HelpCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { roleLabel } from '../constants/roles';

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-emerald-600 text-white'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

const Navbar = () => {
  const { user, logout, isPrimaryAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold tracking-wide text-emerald-400">
            SMAUG
          </span>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/consoles" className={linkClass}>
              Consoles
            </NavLink>
            <NavLink to="/games" className={linkClass}>
              Jogos
            </NavLink>
            <NavLink to="/achievements" className={linkClass}>
              Conquistas
            </NavLink>
            <NavLink to="/quiz" className={linkClass}>
              <HelpCircle className="h-4 w-4" />
              Quiz Diário
            </NavLink>
            {isPrimaryAdmin ? (
              <NavLink to="/users" className={linkClass}>
                <Shield className="h-4 w-4" />
                Usuários
              </NavLink>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm text-slate-200">{user?.name}</p>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              {roleLabel(user?.role)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-red-600 hover:text-white"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
