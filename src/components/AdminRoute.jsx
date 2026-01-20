import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <p className="p-6 font-bold">🔐 Checking auth...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};


export default AdminRoute;
