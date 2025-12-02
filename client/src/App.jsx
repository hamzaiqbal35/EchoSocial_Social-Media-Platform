import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import People from './pages/People';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import PostView from './pages/PostView';
import AdminRoute from './components/AdminRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-bg-primary">
                      <Navbar />
                      <Home />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post/:id"
                element={
                  <div className="min-h-screen bg-bg-primary">
                    <Navbar />
                    <PostView />
                  </div>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-bg-primary">
                      <Navbar />
                      <Profile />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-bg-primary">
                      <Navbar />
                      <Notifications />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/people"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-bg-primary">
                      <Navbar />
                      <People />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <div className="min-h-screen bg-bg-primary">
                      <Navbar />
                      <AdminDashboard />
                    </div>
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
