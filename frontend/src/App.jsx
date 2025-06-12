import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import StudentLoginForm from "./pages/StudentLoginForm";
import SenateLoginForm from "./pages/SenateLoginForm";
import VerifierLoginForm from "./pages/VerifierLoginForm";
import StudentDashboard from "./pages/StudentDashboard";
import SenateDashboard from "./pages/SenateDashboard";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home"


function RootRoute() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  console.log("RootRoute: token=", !!token, "user=", user, "role=", user?.role);

  if (!token || !user) {
    console.log("RootRoute: Rendering Home (no token or user)");
    return <Home />;
  }

  if (user.role === "recipient") {
    console.log("RootRoute: Rendering StudentDashboard");
    return <StudentDashboard />;
  }

  if (user.role === "issuer") {
    console.log("RootRoute: Rendering SenateDashboard");
    return <SenateDashboard />;
  }

  console.log("RootRoute: Rendering Home (unknown role)");
  return <Home />;
}

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  console.log("ProtectedRoute: token=", !!token, "user=", user, "requiredRole=", requiredRole);

  if (!token || !user) {
    console.log("ProtectedRoute: Redirecting to /student-login");
    return <Navigate to="/student-login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log("ProtectedRoute: Redirecting to /");
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const showHeaderRoutes = ["/student-login", "/senate-login", "/verifier-login"];
  const showHeader = showHeaderRoutes.includes(location.pathname) || (location.pathname === "/" && !user);

  console.log("App: pathname=", location.pathname, "user=", user, "showHeader=", showHeader);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/student-login" element={<StudentLoginForm />} />
        <Route path="/senate-login" element={<SenateLoginForm />} />
        <Route path="/verifier-login" element={<VerifierLoginForm />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;