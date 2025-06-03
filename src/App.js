import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Home from './components/Home';

const HomeWithUser = () => {
  const location = useLocation();
  const usuarioId = location.state?.usuarioId || null;
  return <Home usuarioId={usuarioId} />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<HomeWithUser />} />
    </Routes>
  );
};

export default App;
