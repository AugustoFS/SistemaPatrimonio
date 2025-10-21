import React from "react";
import "../App.css";

function Introducao() {
    return (
        <div className="introducao-container">
            <main className="intro-main">
                <h1>Bem-vindo ao Sistema de Gerenciamento de Patrimônios</h1>
                <p>
                    Este sistema foi desenvolvido com o foco em auxiliar pequenas empresas
                    e instituições públicas, como escolas, no controle e gerenciamento
                    eficiente de seus bens e patrimônios.
                </p>
            </main>
        </div>
    );
}

export default Introducao;
