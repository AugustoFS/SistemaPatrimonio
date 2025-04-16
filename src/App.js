import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin
        ? `/api/usuarios?email=${email}&senha=${password}`
        : `/api/usuarios`;

      const method = isLogin ? 'GET' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(method === 'POST' && { body: JSON.stringify({ email, senha: password }) })
      });

      const data = await response.json();

      if (isLogin) {
        if (data.autenticado) {
          setMessage('');
          navigate('/home');
        } else {
          setMessage('Credenciais inválidas!');
        }
      } else {
        if (response.ok) {
          setMessage('');
          navigate('/home');
        } else {
          setMessage(data.erro || 'Erro ao cadastrar usuário.');
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro na comunicação com o servidor.');
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="container">
      <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
      <form onSubmit={handleSubmit} className="form">
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
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <button onClick={handleSwitch} className="toggle">
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
      </button>
    </div>
  );
};

export default App;
