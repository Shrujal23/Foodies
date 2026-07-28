import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user && user.role !== 'admin' ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
          <div className="max-w-xl w-full rounded-3xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-gray-900 shadow-lg p-8 text-center">
            <h1 className="text-2xl font-semibold text-red-700 dark:text-red-300">Admin access required</h1>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">You do not have permission to view this page. Please sign in with an admin account.</p>
          </div>
        </div>
      ) : (
        children
      )}
    </ProtectedRoute>
  );
}
