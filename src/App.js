import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import Principal from "./components/Principal";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="bg-slate-300 text-black h-screen flex text-white">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/principal" element={<ProtectedRoute><Principal /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
