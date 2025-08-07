import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';

function App() {
  const [usuarioId, setUsuarioId] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={setUsuarioId} />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/produtos" element={<div>Bem-vindo, usuário {usuarioId}!</div>} />
    </Routes>
  );
}

export default App;
