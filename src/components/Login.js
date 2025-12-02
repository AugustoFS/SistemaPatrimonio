import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://sistema-patrimonio.vercel.app/api/usuarios?email=${email}&senha=${senha}`
      );

      const data = await response.json();

      if (!response.ok || !data.autenticado) {
        setMensagem(data.erro || "Email ou senha inválidos.");
        return;
      }

      localStorage.setItem("usuarioLogado", data.usuario_id);

      if (onLoginSuccess) {
        onLoginSuccess(data.usuario_id);
      }

      navigate("/produtos");
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="introducao-container">
      <header className="intro-header">
        <h2 className="intro-logo">Sistema de Patrimônios</h2>
      </header>

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
          Ainda não tem conta? Cadastre-se
        </button>
      </div>

      <footer className="intro-footer">
        <p>© Sistema de Patrimônios 2025</p>
      </footer>
    </div>
  );
};

export default Login;
