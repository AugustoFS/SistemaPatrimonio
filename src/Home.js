import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Home = () => {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        valor: '',
        status: '',
        localizacao: '',
        aquisicao: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = () => {
        fetch('/api/produtos')
            .then((res) => res.json())
            .then((data) => setProdutos(data))
            .catch((err) => console.error('Erro ao buscar produtos:', err));
    };

    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Aqui você pode adicionar validações básicas, se quiser
        try {
            const res = await fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                setMessage(`Erro: ${error.erro || 'Falha ao cadastrar produto'}`);
                return;
            }

            setMessage('Produto cadastrado com sucesso!');
            setFormData({
                nome: '',
                valor: '',
                status: '',
                localizacao: '',
                aquisicao: '',
            });
            setShowForm(false);
            fetchProdutos(); // Atualiza a lista após cadastro
        } catch (error) {
            setMessage('Erro ao cadastrar produto.');
            console.error(error);
        }
    };

    return (
        <div className="container">
            <h2>Lista de Produtos</h2>

            {produtos.length === 0 ? (
                <p>Nenhum produto cadastrado.</p>
            ) : (
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Localização</th>
                            <th>Aquisição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto) => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.nome}</td>
                                <td>R$ {produto.valor}</td>
                                <td>{produto.status}</td>
                                <td>{produto.localizacao}</td>
                                <td>{new Date(produto.aquisicao).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button className="button" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancelar cadastro' : 'Cadastrar Produto'}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="form" style={{ marginTop: 20 }}>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="valor"
                        placeholder="Valor"
                        value={formData.valor}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                    <input
                        type="text"
                        name="status"
                        placeholder="Status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                    <input
                        type="text"
                        name="localizacao"
                        placeholder="Localização"
                        value={formData.localizacao}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                    <input
                        type="date"
                        name="aquisicao"
                        placeholder="Aquisição"
                        value={formData.aquisicao}
                        onChange={handleInputChange}
                        required
                        className="input"
                    />
                    <button type="submit" className="button">
                        Salvar Produto
                    </button>
                    {message && <p className="message">{message}</p>}
                </form>
            )}

            <button className="button" onClick={() => navigate('/')}>
                Voltar para Login
            </button>
        </div>
    );
};

export default Home;
