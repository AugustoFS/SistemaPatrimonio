import React, { useState, useEffect } from 'react';
import '../App.css';

const API_URL = 'https://sistema-patrimonio.vercel.app'; // URL base da API

function TabelaProdutos({ usuarioId }) {
    const [produtos, setProdutos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoAtual, setProdutoAtual] = useState({ id: '', nome: '', valor: '', condicao: '', localizacao: '', aquisicao: '' });
    const [editando, setEditando] = useState(false);
    const [erro, setErro] = useState('');

    // Buscar produtos do usuário ao carregar ou quando usuarioId mudar
    useEffect(() => {
        if (!usuarioId) return;

        fetch(`${API_URL}?usuario_id=${usuarioId}`)
            .then(res => res.json())
            .then(data => {
                setProdutos(data);
            })
            .catch(() => setProdutos([]));
    }, [usuarioId]);

    const abrirModal = (produto = { id: '', nome: '', valor: '', condicao: '', localizacao: '', aquisicao: '' }) => {
        setProdutoAtual(produto);
        setEditando(!!produto.id);
        setModalAberto(true);
        setErro('');
    };

    const fecharModal = () => {
        setModalAberto(false);
        setProdutoAtual({ id: '', nome: '', valor: '', condicao: '', localizacao: '', aquisicao: '' });
        setEditando(false);
        setErro('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProdutoAtual({ ...produtoAtual, [name]: value });
    };

    const salvarProduto = () => {
        const { nome, valor, condicao, localizacao, aquisicao, id } = produtoAtual;

        if (!nome || !valor || !condicao || !localizacao || !aquisicao) {
            setErro('Todos os campos são obrigatórios.');
            return;
        }

        const metodo = editando ? 'PUT' : 'POST';
        const url = editando ? `${API_URL}/${id}` : API_URL;

        // Use "usuario_id" no corpo para corresponder ao backend
        const corpo = { ...produtoAtual, usuario_id: usuarioId };

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpo),
        })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao salvar produto');
                return res.json();
            })
            .then(produtoSalvo => {
                if (editando) {
                    setProdutos(produtos.map(p => (p.id === produtoSalvo.id ? produtoSalvo : p)));
                } else {
                    setProdutos([...produtos, produtoSalvo]);
                }
                fecharModal();
            })
            .catch(() => setErro('Erro ao salvar produto. Tente novamente.'));
    };

    const excluirProduto = (id) => {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao excluir produto');
                setProdutos(produtos.filter(p => p.id !== id));
            })
            .catch(() => alert('Erro ao excluir produto. Tente novamente.'));
    };

    return (
        <div className="main-content">
            <div className="table-header">
                <h2>Produtos</h2>
                <button className="button" onClick={() => abrirModal()}>Adicionar Produto</button>
            </div>

            <table className="produtos-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Condição</th>
                        <th>Localização</th>
                        <th>Aquisição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td>{produto.nome}</td>
                            <td>{produto.valor}</td>
                            <td>{produto.condicao}</td>
                            <td>{produto.localizacao}</td>
                            <td>{produto.aquisicao}</td>
                            <td>
                                <button className="button" onClick={() => abrirModal(produto)}>Editar</button>
                                <button className="button cancel-button" onClick={() => excluirProduto(produto.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    {produtos.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum produto cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {modalAberto && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>{editando ? 'Editar Produto' : 'Adicionar Produto'}</h3>

                        {erro && <div className="error">{erro}</div>}

                        <div className="form">
                            <input
                                type="text"
                                name="nome"
                                placeholder="Nome"
                                value={produtoAtual.nome}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="valor"
                                placeholder="Valor"
                                value={produtoAtual.valor}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="condicao"
                                placeholder="Condição"
                                value={produtoAtual.condicao}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="localizacao"
                                placeholder="Localização"
                                value={produtoAtual.localizacao}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="aquisicao"
                                placeholder="Aquisição"
                                value={produtoAtual.aquisicao}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <button className="button" onClick={salvarProduto}>Salvar</button>
                            <button className="button cancel-button" onClick={fecharModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TabelaProdutos;
