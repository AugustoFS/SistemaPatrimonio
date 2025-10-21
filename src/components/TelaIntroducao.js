// src/components/TelaIntroducao.js
import React from "react";
import HeaderFooter from "./HeaderFooter";
import "../App.css";

function Introducao({ usuarioId, onLogout }) {
  return (
    <div className="introducao-container">
      <HeaderFooter usuarioId={usuarioId} onLogout={onLogout} />

      {/* Corpo */}
      <main className="intro-main">
        <h1>Bem-vindo ao Sistema de Gerenciamento de Patrimônios</h1>
        <p>
          Este sistema foi desenvolvido para auxiliar pequenas empresas e
          instituições públicas, como escolas, no controle e gerenciamento
          eficiente de seus bens e patrimônios.
        </p>
      </main>
    </div>
  );
}

export default Introducao;
