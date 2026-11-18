import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, allowPrimaryAdmin = false, allowAdmin = false }) => {
  const { loading, isAuthenticated, isAdmin, isPrimaryAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowPrimaryAdmin && !isPrimaryAdmin) {
    return <Navigate to="/" replace />;
  }

  if (allowAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
