import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
            const data = await response.json();

            if (data.autenticado) {
                onLoginSuccess(data.usuario_id);
                navigate('/produtos');
            } else {
                setMensagem('Email ou senha inválidos.');
            }
        } catch {
            setMensagem('Erro ao conectar com o servidor.');
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="form">
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    required
                    onChange={(e) => setSenha(e.target.value)}
                    className="input"
                />
                <button type="submit" className="button">Entrar</button>
            </form>
            {mensagem && <p className="message">{mensagem}</p>}
            <button onClick={() => navigate('/cadastro')} className="toggle">Não tem conta? Cadastre-se</button>
        </div>
    );
};

export default Login;
