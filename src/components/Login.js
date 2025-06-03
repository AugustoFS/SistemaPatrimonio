import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/usuarios?email=${email}&senha=${password}`);
            const data = await response.json();

            if (data.autenticado) {
                navigate('/home', { state: { usuarioId: data.usuario_id } });
            } else {
                setMessage('Credenciais inválidas!');
            }
        } catch {
            setMessage('Erro na comunicação com o servidor.');
        }

        setEmail('');
        setPassword('');
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
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
                <button type="submit" className="button">Entrar</button>
            </form>
            {message && <p className="message">{message}</p>}
            <button onClick={() => navigate('/cadastro')} className="toggle">
                Não tem conta? Cadastre-se
            </button>
        </div>
    );
};

export default Login;
