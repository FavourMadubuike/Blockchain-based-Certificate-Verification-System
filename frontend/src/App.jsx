import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import StudentLoginForm from "./pages/StudentLoginForm";
import SenateLoginForm from "./pages/SenateLoginForm";
import VerifierLoginForm from "./pages/VerifierLoginForm";
import Home from "./components/Home";


function App() {
  const location = useLocation();

  // Add any route here where you want to hide the header
  const hideHeaderRoutes = ["/student-login", "/senate-login", "/verifier-login"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-login" element={<StudentLoginForm />} />
        <Route path="/senate-login" element={<SenateLoginForm />} />
        <Route path="/verifier-login" element={<VerifierLoginForm />} />
      </Routes>
    </>
  );
}

export default App;