import React from "react";
import "../App.css";

function TelaIntroducao({ onLogin, onSignup }) {
    return (
        <div className="intro-container">
            {/* ===== Cabeçalho ===== */}
            <header className="intro-header">
                <h1 className="logo">Gerenciamento de Patrimônios</h1>
                <div className="auth-buttons">
                    <button className="button small" onClick={onLogin}>Login</button>
                    <button className="button small outline" onClick={onSignup}>Sign Up</button>
                </div>
            </header>

            {/* ===== Corpo principal ===== */}
            <main className="intro-main">
                <h2 className="intro-title">Bem-vindo ao Sistema de Gerenciamento de Patrimônios</h2>
                <p className="intro-text">
                    Nosso sistema foi desenvolvido para facilitar o controle e a administração de bens e patrimônios,
                    com foco em atender pequenas empresas e instituições públicas — como escolas e órgãos municipais —
                    garantindo uma gestão eficiente, segura e moderna.
                </p>
            </main>

            {/* ===== Rodapé ===== */}
            <footer className="intro-footer">
                <p>© 2025 Gerenciamento de Patrimônios</p>
            </footer>
        </div>
    );
}

export default TelaIntroducao;
