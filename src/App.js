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

  return (
    <Routes>
      <Route path="/" element={<Introducao />} />
      <Route path="/login" element={<Login onLoginSuccess={setUsuarioId} />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/produtos" element={<TabelaProdutos usuarioId={usuarioId} />} />
    </Routes>
  );
}

export default App;
