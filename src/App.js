import React from 'react';
import './App.css';
import TabelaProdutos from './components/TabelaProdutos';

function App() {
  return (
    <div className="home-container">
      <div className="sidebar">
        <h3>Sistema de Patrimônio</h3>
      </div>
      <div className="header"></div>
      <TabelaProdutos />
    </div>
  );
}

export default App;
