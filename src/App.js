// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '../App.css';

import Login from './components/Login';
import Cadastro from './components/Cadastro';
import TabelaProdutos from './components/TabelaProdutos';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  const handleLoginSuccess = (id) => {
    setIsLoggedIn(true);
    setUsuarioId(id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsuarioId(null);
  };

  return (
    <div className="home-container" style={{ padding: '20px' }}>
      {isLoggedIn && (
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/produtos" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/cadastro"
          element={
            isLoggedIn ? (
              <Navigate to="/produtos" />
            ) : (
              <Cadastro onCadastroSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/produtos"
          element={
            isLoggedIn ? (
              <TabelaProdutos usuarioId={usuarioId} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
