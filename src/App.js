import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Introducao from "./components/TelaIntroducao";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import TabelaProdutos from "./components/TabelaProdutos";
import "./App.css";

function App() {
  const [usuarioId, setUsuarioId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const salvo = localStorage.getItem("usuarioLogado");
    if (salvo) setUsuarioId(Number(salvo));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioId(null);
    navigate("/");
  };

  return (
    <div className="app-container">
      {/* Cabeçalho fixo */}
      <header className="global-header">
        <h2 className="intro-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Sistema de Patrimônios
        </h2>
        <div className="intro-links">
          {!usuarioId ? (
            <>
              <Link to="/login" className="intro-link">Login</Link>
              <Link to="/cadastro" className="intro-link">Sign Up</Link>
            </>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo dinâmico */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Introducao />} />
          <Route path="/login" element={<Login onLoginSuccess={setUsuarioId} />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/produtos" element={<TabelaProdutos usuarioId={usuarioId} />} />
        </Routes>
      </main>

      {/* Rodapé fixo */}
      <footer className="global-footer">
        <p>© Sistema de Patrimônios 2025</p>
      </footer>
    </div>
  );
}

export default App;
