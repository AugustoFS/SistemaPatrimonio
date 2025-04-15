// App.js
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (isLogin) {
      if (users[email] && users[email] === password) {
        setMessage('');
        navigate('/home');
      } else {
        setMessage('Credenciais inválidas!');
      }
    } else {
      if (users[email]) {
        setMessage('Usuário já cadastrado!');
      } else {
        users[email] = password;
        localStorage.setItem('users', JSON.stringify(users));
        setMessage('');
        navigate('/home');
      }
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
