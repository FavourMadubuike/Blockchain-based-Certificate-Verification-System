import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import StudentLoginForm from "./pages/StudentLoginForm";
import SenateLoginForm from "./pages/SenateLoginForm";
import VerifierLoginForm from "./pages/VerifierLoginForm";
import VerifierRegisterForm from "./pages/VerifierRegisterForm";
import StudentDashboard from "./pages/StudentDashboard";
import SenateDashboard from "./pages/SenateDashboard";
import VerifierDashboard from "./pages/VerifierDashboard";
import Profile from "./components/verifier/Profile";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home";

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
  const showHeaderRoutes = ["/student-login", "/senate-login", "/verifier-login", "/verifier-register"];
  const showHeader = showHeaderRoutes.includes(location.pathname) || (location.pathname === "/" && !user);

  console.log("App: pathname=", location.pathname, "user=", user, "showHeader=", showHeader);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.role === "recipient" ? (
                <ProtectedRoute requiredRole="recipient">
                  <StudentDashboard />
                </ProtectedRoute>
              ) : user.role === "issuer" ? (
                <ProtectedRoute requiredRole="issuer">
                  <SenateDashboard />
                </ProtectedRoute>
              ) : user.role === "verifier" ? (
                <ProtectedRoute requiredRole="verifier">
                  <VerifierDashboard />
                </ProtectedRoute>
              ) : (
                <Home />
              )
            ) : (
              <Home />
            )
          }
        />
        <Route path="/student-login" element={<StudentLoginForm />} />
        <Route path="/senate-login" element={<SenateLoginForm />} />
        <Route path="/verifier-login" element={<VerifierLoginForm />} />
        <Route path="/verifier-register" element={<VerifierRegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="verifier">
              <VerifierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="verifier">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;