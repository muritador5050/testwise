import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../../api/apiClient';
import type { Role } from '../../types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to='/users/login' state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const user = getCurrentUser();

    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to unauthorized page or home
      return <Navigate to='/unauthorized' replace />;
    }
  }

  return <>{children}</>;
};
