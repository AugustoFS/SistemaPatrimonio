import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarios, salvarUsuario } from "../utils/storage";
import '../App.css';

const Cadastro = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    const usuarios = getUsuarios();

    if (usuarios.find((u) => u.email === email)) {
      setMensagem("Usuário já cadastrado.");
      return;
    }

    const novoUsuario = { id: Date.now(), email, senha };
    salvarUsuario(novoUsuario);
    setMensagem("Cadastro realizado com sucesso!");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
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
        <button type="submit" className="button">Cadastrar</button>
      </form>

      {mensagem && <p className="message">{mensagem}</p>}

      <button onClick={() => navigate("/login")} className="toggle">
        Já tem conta? Faça sua Entrada
      </button>
    </div>
  );
};

export default Cadastro;
