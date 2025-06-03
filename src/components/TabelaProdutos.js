import React, { useState } from 'react';
import '../App.css';

function TabelaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoAtual, setProdutoAtual] = useState({ id: '', nome: '', valor: '', condicao: '', localizacao: '', aquisicao: '' });
    const [editando, setEditando] = useState(false);
    const [erro, setErro] = useState('');

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
        const { nome, valor, condicao, localizacao, aquisicao } = produtoAtual;
        if (!nome || !valor || !condicao || !localizacao || !aquisicao) {
            setErro('Todos os campos são obrigatórios.');
            return;
        }

        if (editando) {
            setProdutos(produtos.map(p => (p.id === produtoAtual.id ? produtoAtual : p)));
        } else {
            setProdutos([...produtos, { ...produtoAtual, id: Date.now() }]);
        }
        fecharModal();
    };

    const excluirProduto = (id) => {
        setProdutos(produtos.filter(p => p.id !== id));
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

                            <div className="form-buttons">
                                <button className="button" onClick={salvarProduto}>Salvar</button>
                                <button className="button cancel-button" onClick={fecharModal}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TabelaProdutos;
