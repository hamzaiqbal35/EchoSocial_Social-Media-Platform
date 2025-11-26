import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/welcome" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
