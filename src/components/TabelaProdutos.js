import React, { useEffect, useState } from 'react';
import '../App.css';

const API_URL = 'https://sistema-patrimonio.vercel.app';

function TabelaProdutos({ usuarioId }) {
    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState({ id: null, nome: '', valor: '', condicao: '', localizacao: '', aquisicao: '' });
    const [erro, setErro] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        if (!usuarioId) return;

        fetch(`${API_URL}/api/produtos?usuario_id=${usuarioId}`)
            .then(res => res.json())
            .then(setProdutos)
            .catch(() => setProdutos([]));
    }, [usuarioId]);

    const abrirModal = (p = { nome: '', valor: '', condicao: '', localizacao: '', aquisicao: '' }) => {
        setProduto(p);
        setEditando(!!p.id);
        setModalAberto(true);
        setErro('');
    };

    const fecharModal = () => {
        setModalAberto(false);
        setProduto({ id: null, nome: '', valor: '', condicao: '', localizacao: '', aquisicao: '' });
        setEditando(false);
        setErro('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduto({ ...produto, [name]: value });
    };

    const salvarProduto = async () => {
        const { nome, valor, condicao, localizacao, aquisicao } = produto;

        if (!nome || !valor || !condicao || !localizacao || !aquisicao) {
            setErro('Todos os campos são obrigatórios.');
            return;
        }

        const metodo = editando ? 'PUT' : 'POST';
        const url = editando ? `${API_URL}/api/produtos/${produto.id}` : `${API_URL}/api/produtos`;

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...produto, usuario_id: usuarioId }),
            });

            if (!res.ok) throw new Error();

            const produtoSalvo = await res.json();
            setProdutos(editando
                ? produtos.map(p => p.id === produtoSalvo.id ? produtoSalvo : p)
                : [...produtos, produtoSalvo]);
            fecharModal();
        } catch {
            setErro('Erro ao salvar produto. Tente novamente.');
        }
    };

    const excluirProduto = async (id) => {
        if (!window.confirm('Deseja excluir este produto?')) return;

        try {
            const res = await fetch(`${API_URL}/api/produtos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setProdutos(produtos.filter(p => p.id !== id));
        } catch {
            alert('Erro ao excluir produto.');
        }
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
                    {produtos.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum produto cadastrado.</td>
                        </tr>
                    ) : produtos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.valor}</td>
                            <td>{p.condicao}</td>
                            <td>{p.localizacao}</td>
                            <td>{p.aquisicao}</td>
                            <td>
                                <button className="button" onClick={() => abrirModal(p)}>Editar</button>
                                <button className="button cancel-button" onClick={() => excluirProduto(p.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalAberto && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>{editando ? 'Editar Produto' : 'Novo Produto'}</h3>

                        {erro && <div className="error">{erro}</div>}

                        <div className="form">
                            <input type="text" name="nome" placeholder="Nome" value={produto.nome} onChange={handleChange} />
                            <input type="text" name="valor" placeholder="Valor" value={produto.valor} onChange={handleChange} />
                            <input type="text" name="condicao" placeholder="Condição" value={produto.condicao} onChange={handleChange} />
                            <input type="text" name="localizacao" placeholder="Localização" value={produto.localizacao} onChange={handleChange} />
                            <input type="text" name="aquisicao" placeholder="Aquisição" value={produto.aquisicao} onChange={handleChange} />
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
