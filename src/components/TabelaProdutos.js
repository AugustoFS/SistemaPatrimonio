// src/components/TabelaProdutos.js
import React, { useEffect, useState } from "react";
import "../App.css";
import {
  getProdutos,
  salvarProduto,
  atualizarProduto,
  excluirProduto,
} from "../utils/storage";

function TabelaProdutos({ usuarioId }) {
  const [produtos, setProdutos] = useState([]);
  const [produto, setProduto] = useState({
    id: null,
    nome: "",
    valor: "",
    condicao: "",
    localizacao: "",
    aquisicao: "",
  });
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (usuarioId) {
      setProdutos(getProdutos(usuarioId));
    }
  }, [usuarioId]);

  const abrirModal = (
    p = { nome: "", valor: "", condicao: "", localizacao: "", aquisicao: "" }
  ) => {
    setProduto(p);
    setEditando(!!p.id);
    setModalAberto(true);
    setErro("");
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProduto({
      id: null,
      nome: "",
      valor: "",
      condicao: "",
      localizacao: "",
      aquisicao: "",
    });
    setEditando(false);
    setErro("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const salvar = () => {
    const { nome, valor, condicao, localizacao, aquisicao } = produto;

    if (!nome || !valor || !condicao || !localizacao || !aquisicao) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    if (editando) {
      const atualizado = { ...produto, usuarioId };
      atualizarProduto(atualizado);
      setProdutos(
        produtos.map((p) => (p.id === atualizado.id ? atualizado : p))
      );
    } else {
      const novo = salvarProduto({ ...produto, usuarioId });
      setProdutos([...produtos, novo]);
    }

    fecharModal();
  };

  const excluir = (id) => {
    if (!window.confirm("Deseja excluir este produto?")) return;
    excluirProduto(id);
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  const handleExportar = () => {
    alert("Função de exportação será implementada futuramente.");
  };

  const handleHistorico = () => {
    alert("Histórico de ações será adicionado em breve.");
  };

  const handleConfiguracoes = () => {
    alert("Configurações do sistema em desenvolvimento.");
  };

  const handleSair = () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  };

  return (
    <div className="introducao-container">
      {/* Cabeçalho */}
      <header className="intro-header">
        <h2 className="intro-logo">Sistema de Patrimônios</h2>
        <button className="intro-link" onClick={handleSair}>
            Sair
          </button>
      </header>

      {/* Conteúdo principal com sidebar */}
      <div className="conteudo-com-sidebar">
        {/* Barra lateral */}
        <aside className="sidebar">
          <button className="button" onClick={() => abrirModal()}>
            Adicionar
          </button>
          <button className="button" onClick={handleExportar}>
            Exportar
          </button>
          <button className="button" onClick={handleHistorico}>
            Histórico
          </button>
          <button className="button" onClick={handleConfiguracoes}>
            Configurações
          </button>
          <button className="button cancel-button" onClick={handleSair}>
            Sair
          </button>
        </aside>

        {/* Área principal */}
        <main className="tabela-main">
          <div className="main-content">
            <h2>Produtos</h2>

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
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                ) : (
                  produtos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.valor}</td>
                      <td>{p.condicao}</td>
                      <td>{p.localizacao}</td>
                      <td>{p.aquisicao}</td>
                      <td>
                        <button className="button" onClick={() => abrirModal(p)}>
                          Editar
                        </button>
                        <button
                          className="button cancel-button"
                          onClick={() => excluir(p.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {modalAberto && (
              <div className="modal-overlay">
                <div className="modal-card">
                  <h3>{editando ? "Editar Produto" : "Novo Produto"}</h3>

                  {erro && <div className="error">{erro}</div>}

                  <div className="form">
                    <input
                      type="text"
                      name="nome"
                      placeholder="Nome"
                      value={produto.nome}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="valor"
                      placeholder="Valor"
                      value={produto.valor}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="condicao"
                      placeholder="Condição"
                      value={produto.condicao}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="localizacao"
                      placeholder="Localização"
                      value={produto.localizacao}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="aquisicao"
                      placeholder="Aquisição"
                      value={produto.aquisicao}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={{ marginTop: "10px", textAlign: "right" }}>
                    <button className="button" onClick={salvar}>
                      Salvar
                    </button>
                    <button
                      className="button cancel-button"
                      onClick={fecharModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Rodapé */}
      <footer className="intro-footer">
        <p>© Sistema de Patrimônios 2025</p>
      </footer>
    </div>
  );
}

export default TabelaProdutos;
