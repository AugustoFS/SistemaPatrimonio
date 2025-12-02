import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Cadastro = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://sistema-patrimonio.vercel.app/api/usuarios",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.erro || "Erro ao cadastrar.");
        return;
      }

      // Salva usuário logado
      localStorage.setItem("usuarioLogado", data.usuario_id);

      setMensagem("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/produtos"), 1200);
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
        <h2>Cadastrar</h2>

        <form onSubmit={handleCadastro} className="form">
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
            Cadastrar
          </button>
        </form>

        {mensagem && <p className="message">{mensagem}</p>}

        <button onClick={() => navigate("/login")} className="toggle">
          Já tem conta? Faça login
        </button>
      </div>

      <footer className="intro-footer">
        <p>© Sistema de Patrimônios 2025</p>
      </footer>
    </div>
  );
};

export default Cadastro;
