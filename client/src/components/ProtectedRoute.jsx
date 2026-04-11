import { Navigate } from 'react-router-dom';
import { authClient } from '@/lib/authClient';

export const ProtectedRoute = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#F6F8F9] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#E2E8F0] border-t-[#2F5E60] animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
