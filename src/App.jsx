// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentLayout from "./layouts/AgentLayout";
import AddField from './pages/admin/AddField';
import AgentDashboard from "./pages/agent/AgentDashboard";
import api from "./api/axios";
import { useAuthStore } from "./store/authStore";
import FieldList from './pages/admin/FieldList';
import AgentTasks from "./pages/agent/AgentTasks"; 
import UserManagement from './pages/admin/UserManagement';

// A simple Route Guard component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null; // Wait for the check to finish
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to="/" replace />; // Kick out unauthorized roles

  return children;
};

function App() {
  const { setUser, clearAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get("/api/user");
        setUser(response.data);
      } catch (error) {
        clearAuth();
      }
    };
    fetchSession();
  }, [setUser, clearAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse font-bold text-primary">
          Loading Smart Season...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password-reset/:token" element={<ResetPassword />} />

      {/* Admin Routes wrapped in Layout and Guard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="fields/new" element={<AddField />} />
        <Route path="fields" element={<FieldList />} /> 
        <Route path="users" element={<UserManagement />} /> 
      </Route>

      {/* Agent Routes wrapped in Layout and Guard */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute requiredRole="field_agent">
            <AgentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="tasks" element={<AgentTasks />} /> 
      </Route>
    </Routes>
  );
}

export default App;
