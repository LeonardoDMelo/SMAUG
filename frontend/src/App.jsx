import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AchievementToastProvider } from './context/AchievementToastContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Consoles from './pages/Consoles';
import Games from './pages/Games';
import Achievements from './pages/Achievements';
import Quiz from './pages/Quiz';

const App = () => {
  return (
    <AuthProvider>
      <AchievementToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/consoles"
            element={
              <PrivateRoute>
                <Consoles />
              </PrivateRoute>
            }
          />
          <Route
            path="/games"
            element={
              <PrivateRoute>
                <Games />
              </PrivateRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <PrivateRoute>
                <Achievements />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <PrivateRoute>
                <Quiz />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AchievementToastProvider>
    </AuthProvider>
  );
};

export default App;
