// src/components/HeaderFooter.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const HeaderFooter = ({ usuarioId, onLogout }) => {
    const navigate = useNavigate();

    return (
        <>
            {/* Cabeçalho */}
            <header className="intro-header">
                <h2
                    className="intro-logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    Sistema de Patrimônios
                </h2>

                <div className="intro-links">
                    {!usuarioId ? (
                        <>
                            <Link to="/login" className="intro-link">
                                Login
                            </Link>
                            <Link to="/cadastro" className="intro-link">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <button className="logout-button" onClick={onLogout}>
                            Sair
                        </button>
                    )}
                </div>
            </header>

            {/* Rodapé */}
            <footer className="intro-footer">
                <p>© Sistema de Patrimônios 2025</p>
            </footer>
        </>
    );
};

export default HeaderFooter;
