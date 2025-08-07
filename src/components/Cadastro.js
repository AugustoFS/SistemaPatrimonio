import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Cadastro = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    const handleCadastro = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (data.usuario_id) {
                setMensagem('Cadastro realizado com sucesso!');
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMensagem('Erro ao cadastrar usuário.');
            }
        } catch {
            setMensagem('Erro na comunicação com o servidor.');
        }
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
                    value={senha}
                    required
                    onChange={(e) => setSenha(e.target.value)}
                    className="input"
                />
                <button type="submit" className="button">Cadastrar</button>
            </form>
            {mensagem && <p className="message">{mensagem}</p>}
            <button onClick={() => navigate('/')} className="toggle">Já tem conta? Fazer login</button>
        </div>
    );
};

export default Cadastro;
