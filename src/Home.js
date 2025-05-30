import React, { useEffect, useState } from 'react';
import './App.css';

const Home = ({ usuarioId }) => {  // Recebe o usuarioId via props
    const [produtos, setProdutos] = useState([]);
    const [showCard, setShowCard] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        valor: '',
        status: '',
        localizacao: '',
        aquisicao: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Buscar produtos da API com usuario_id
    const fetchProdutos = async () => {
        if (!usuarioId) {
            setError('Usuário não autenticado');
            return;
        }

        try {
            const res = await fetch(`/api/produtos?usuario_id=${usuarioId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setProdutos(data);
                setError('');
            } else {
                setProdutos([]);
                setError('Resposta inesperada da API');
            }
        } catch {
            setError('Erro ao buscar produtos');
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, [usuarioId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!usuarioId) {
            setError('Usuário não autenticado');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, usuario_id: usuarioId }), // envia usuario_id junto
            });

            if (!res.ok) {
                const errData = await res.json();
                setError(errData.erro || 'Erro ao cadastrar produto');
                setLoading(false);
                return;
            }

            setForm({ nome: '', valor: '', status: '', localizacao: '', aquisicao: '' });
            setShowCard(false);

            await fetchProdutos(); // Atualiza lista após cadastro
        } catch {
            setError('Erro ao cadastrar produto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <header className="header"></header>

            <aside className="sidebar">
                <h3>Menu</h3>
            </aside>

            <main className="main-content">
                <div className="table-header">
                    <h2>Produtos</h2>
                    <button className="button" onClick={() => setShowCard(true)}>
                        Adicionar
                    </button>
                </div>

                {error && <p className="error">{error}</p>}

                <table className="produtos-table">
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
                        {produtos.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    Nenhum produto cadastrado.
                                </td>
                            </tr>
                        ) : (
                            produtos.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nome}</td>
                                    <td>R$ {Number(p.valor).toFixed(2)}</td>
                                    <td>{p.status}</td>
                                    <td>{p.localizacao}</td>
                                    <td>{new Date(p.aquisicao).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {showCard && (
                    <div className="modal-overlay" onClick={() => setShowCard(false)}>
                        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                            <h3>Adicionar Produto</h3>
                            <form onSubmit={handleSubmit} className="form">
                                <input
                                    name="nome"
                                    type="text"
                                    placeholder="Nome"
                                    value={form.nome}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    name="valor"
                                    type="number"
                                    step="0.01"
                                    placeholder="Valor"
                                    value={form.valor}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    name="status"
                                    type="text"
                                    placeholder="Status"
                                    value={form.status}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    name="localizacao"
                                    type="text"
                                    placeholder="Localização"
                                    value={form.localizacao}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    name="aquisicao"
                                    type="date"
                                    value={form.aquisicao}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="form-buttons">
                                    <button type="submit" disabled={loading} className="button">
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCard(false)}
                                        className="button cancel-button"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
