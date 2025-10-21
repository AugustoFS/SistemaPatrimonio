import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Introducao() {
    return (
        <div className="introducao-container">
            {/* Cabeçalho */}
            <header className="intro-header">
                <h2 className="intro-logo">Sistema de Patrimônios</h2>
                <div className="intro-links">
                    <Link to="/login" className="intro-link">Login</Link>
                    <Link to="/cadastro" className="intro-link">Sign Up</Link>
                </div>
            </header>

            {/* Corpo */}
            <main className="intro-main">
                <h1>Bem-vindo ao Sistema de Gerenciamento de Patrimônios</h1>
                <p>
                    Este sistema foi desenvolvido com o foco em auxiliar pequenas empresas
                    e instituições públicas, como escolas, no controle e gerenciamento
                    eficiente de seus bens e patrimônios.
                </p>
            </main>

            {/* Rodapé */}
            <footer className="intro-footer">
                <p>© Sistema de Patrimônios 2025</p>
            </footer>
        </div>
    );
}

export default Introducao;
