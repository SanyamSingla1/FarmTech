import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  let user = null;

  try {
    const data = localStorage.getItem("user");

    if (data && data !== "undefined") {
      user = JSON.parse(data);
    }
  } catch (err) {
    console.error("Bad user data in localStorage");
    localStorage.removeItem("user");
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}