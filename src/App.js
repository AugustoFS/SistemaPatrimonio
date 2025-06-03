// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
    <Router>
      <div className="home-container">
        <div className="sidebar">
          <h3>Sistema de Patrimônio</h3>
          {isLoggedIn && (
            <button onClick={handleLogout} style={{ marginTop: '20px' }}>
              Sair
            </button>
          )}
        </div>

        <div className="main-content" style={{ flex: 1, padding: '20px' }}>
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
      </div>
    </Router>
  );
}

export default App;
