// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarios } from "../utils/storage";
import HeaderFooter from "./HeaderFooter";
import "../App.css";

const Login = ({ onLoginSuccess, usuarioId, onLogout }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarios = getUsuarios();
    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuario) {
      onLoginSuccess(usuario.id);
      localStorage.setItem("usuarioLogado", usuario.id);
      navigate("/produtos");
    } else {
      setMensagem("Email ou senha inválidos.");
    }
  };

  return (
    <div className="page-container">
      <HeaderFooter usuarioId={usuarioId} onLogout={onLogout} />

      <div className="container">
        <h2>Entrar</h2>
        <form onSubmit={handleLogin} className="form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            required
            onChange={(e) => setSenha(e.target.value)}
            className="input"
          />
          <button type="submit" className="button">
            Entrar
          </button>
        </form>
        {mensagem && <p className="message">{mensagem}</p>}
        <button onClick={() => navigate("/cadastro")} className="toggle">
          Não tem conta? Cadastre-se
        </button>
      </div>
    </div>
  );
};

export default Login;
