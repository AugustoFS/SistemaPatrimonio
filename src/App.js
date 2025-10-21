// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Introducao from "./components/TelaIntroducao";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import TabelaProdutos from "./components/TabelaProdutos";

function App() {
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    if (salvo) setUsuarioId(Number(salvo));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioId(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Introducao usuarioId={usuarioId} onLogout={handleLogout} />} />
      <Route path="/login" element={<Login usuarioId={usuarioId} onLoginSuccess={setUsuarioId} onLogout={handleLogout} />} />
      <Route path="/cadastro" element={<Cadastro usuarioId={usuarioId} onLogout={handleLogout} />} />
      <Route path="/produtos" element={<TabelaProdutos usuarioId={usuarioId} onLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;
