import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Cadastro = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleCadastro = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha: password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/home', { state: { usuarioId: data.usuario_id } });
            } else {
                setMessage(data.erro || 'Erro ao cadastrar usuário.');
            }
        } catch {
            setMessage('Erro na comunicação com o servidor.');
        }

        setEmail('');
        setPassword('');
    };

    return (
        <div className="container">
            <h2>Cadastro</h2>
            <form onSubmit={handleCadastro} className="form">
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
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
                <button type="submit" className="button">Cadastrar</button>
            </form>
            {message && <p className="message">{message}</p>}
            <button onClick={() => navigate('/')} className="toggle">
                Já tem conta? Faça login
            </button>
        </div>
    );
};

export default Cadastro;
