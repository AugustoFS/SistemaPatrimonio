import React, { useState } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home'; // importe o Home aqui
import './App.css';

// Componente auxiliar para pegar o estado enviado na navegação e passar para Home
const HomeWithUser = () => {
  const location = useLocation();
  const usuarioId = location.state?.usuarioId || null;
  return <Home usuarioId={usuarioId} />;
};

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [usuarioId, setUsuarioId] = useState(null); // guarda o id do usuário
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
        ...(method === 'POST' && { body: JSON.stringify({ email, senha: password }) }),
      });

      const data = await response.json();

      if (isLogin) {
        if (data.autenticado) {
          setMessage('');
          setUsuarioId(data.usuario_id); // armazena o ID retornado da API
          navigate('/home', { state: { usuarioId: data.usuario_id } });
        } else {
          setMessage('Credenciais inválidas!');
        }
      } else {
        if (response.ok) {
          setMessage('');
          setUsuarioId(data.usuario_id); // armazena id do usuário cadastrado
          navigate('/home', { state: { usuarioId: data.usuario_id } });
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
    <Routes>
      <Route
        path="/"
        element={
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
        }
      />
      <Route path="/home" element={<HomeWithUser />} />
    </Routes>
  );
};

export default App;
