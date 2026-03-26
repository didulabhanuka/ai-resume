import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Shared/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ScreenerPage from './pages/ScreenerPage';
import CoverLetterPage from './pages/CoverLetterPage';
import HistoryPage from './pages/HistoryPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

// Layout with Navbar for protected pages
const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="">
      {children}
    </main>
  </div>
);

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route path="/screener" element={
        <ProtectedRoute>
          <ProtectedLayout><ScreenerPage /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/cover-letter" element={
        <ProtectedRoute>
          <ProtectedLayout><CoverLetterPage /></ProtectedLayout>
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <ProtectedLayout><HistoryPage /></ProtectedLayout>
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/screener" replace />} />
    </Routes>
  );
}