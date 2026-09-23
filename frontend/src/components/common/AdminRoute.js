import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { AccessDeniedPage } from '../../pages/ErrorPage';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user && user.role !== 'admin' ? (
        <AccessDeniedPage />
      ) : (
        children
      )}
    </ProtectedRoute>
  );
}
