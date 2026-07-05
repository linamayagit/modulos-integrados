import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  let rol = null;
  if (token) {
    try { rol = JSON.parse(atob(token.split(".")[1])).rol; } catch { rol = null; }
  }
  if (rol !== "admin") return <Navigate to="/home" replace />;
  return children;
}
