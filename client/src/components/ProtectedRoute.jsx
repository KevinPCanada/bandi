import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading state while we check if the user is logged in
  if (loading) {
    return <div>Loading session...</div>;
  }

  // If there's no user, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, show the page they wanted to see
  return children;
};

export default ProtectedRoute;
