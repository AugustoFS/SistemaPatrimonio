import React, { useState } from 'react';

const CadastrarProduto = ({ usuarioId }) => {
    const [form, setForm] = useState({
        nome: '',
        valor: '',
        status: '',
        localizacao: '',
        aquisicao: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, usuario_id: usuarioId }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
        } else {
            alert('Erro ao cadastrar: ' + data.erro);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="nome" placeholder="Nome" onChange={handleChange} required />
            <input name="valor" placeholder="Valor" type="number" onChange={handleChange} required />
            <input name="status" placeholder="Status" onChange={handleChange} required />
            <input name="localizacao" placeholder="Localização" onChange={handleChange} required />
            <input name="aquisicao" type="date" onChange={handleChange} required />
            <button type="submit">Cadastrar Produto</button>
        </form>
    );
};

export default CadastrarProduto;
