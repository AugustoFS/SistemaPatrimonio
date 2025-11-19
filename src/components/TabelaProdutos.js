import React, { useEffect, useState } from "react";
import "../App.css";
import {
  getProdutos,
  salvarProduto,
} from "../utils/storage";

function TabelaProdutos({ usuarioId }) {
  const [produtos, setProdutos] = useState([]);
  const [produto, setProduto] = useState({
    id: "",
    descricao: "",
    valor: "",
    condicao: "em uso",
    localizacao: "",
    aquisicao: "",
  });
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (usuarioId) {
      setProdutos(getProdutos(usuarioId));
    }
  }, [usuarioId]);

  const abrirModal = () => {
    setProduto({
      id: "",
      descricao: "",
      valor: "",
      condicao: "em uso",
      localizacao: "",
      aquisicao: "",
    });
    setModalAberto(true);
    setErro("");
  };

  const fecharModal = () => {
    setModalAberto(false);
    setErro("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatar valor em Reais
    if (name === "valor") {
      const somenteNumeros = value.replace(/\D/g, "");
      const formatado = (Number(somenteNumeros) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      setProduto({ ...produto, valor: formatado });
      return;
    }

    setProduto({ ...produto, [name]: value });
  };

  const salvar = () => {
    const { id, descricao, valor, condicao, localizacao, aquisicao } = produto;

    if (!id || !descricao || !valor || !condicao || !localizacao || !aquisicao) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    const novo = salvarProduto({
      ...produto,
      usuarioId,
    });

    setProdutos([...produtos, novo]);
    fecharModal();
  };

  const handleSair = () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  };

  return (
    <div className="introducao-container">
      <header className="intro-header">
        <h2 className="intro-logo">Sistema de Patrimônios</h2>
        <button onClick={handleSair} className="logout-button">
          Sair
        </button>
      </header>

      <div className="conteudo-com-sidebar">
        <aside className="sidebar">
          <button className="button" onClick={abrirModal}>Adicionar</button>
        </aside>

        <main className="tabela-main">
          <div className="main-content">
            <h2>Produtos</h2>

            <table className="produtos-table produtos-fixa">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th style={{ width: "300px" }}>Descrição</th>
                  <th style={{ width: "120px" }}>Valor</th>
                  <th style={{ width: "140px" }}>Condição</th>
                  <th style={{ width: "300px" }}>Localização</th>
                  <th style={{ width: "140px" }}>Aquisição</th>
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
                      <td>{p.id}</td>
                      <td>{p.descricao}</td>
                      <td>{p.valor}</td>
                      <td>{p.condicao}</td>
                      <td>{p.localizacao}</td>
                      <td>{p.aquisicao}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {modalAberto && (
              <div className="modal-overlay">
                <div className="modal-card">
                  <h3>Novo Produto</h3>

                  {erro && <div className="error">{erro}</div>}

                  <div className="form">

                    <input
                      type="text"
                      name="id"
                      placeholder="ID do Produto"
                      value={produto.id}
                      onChange={handleChange}
                    />

                    <input
                      type="text"
                      name="descricao"
                      placeholder="Descrição (máx. 120 caracteres)"
                      maxLength={120}
                      value={produto.descricao}
                      onChange={handleChange}
                    />

                    <input
                      type="text"
                      name="valor"
                      placeholder="Valor (R$)"
                      value={produto.valor}
                      onChange={handleChange}
                    />

                    <select
                      name="condicao"
                      value={produto.condicao}
                      onChange={handleChange}
                    >
                      <option value="em uso">Em uso</option>
                      <option value="armazenado">Armazenado</option>
                      <option value="descartado">Descartado</option>
                    </select>

                    <input
                      type="text"
                      name="localizacao"
                      placeholder="Localização (máx. 120 caracteres)"
                      maxLength={120}
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
                    <button className="button" onClick={salvar}>Salvar</button>
                    <button className="button cancel-button" onClick={fecharModal}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <footer className="intro-footer">
        <p>© Sistema de Patrimônios 2025</p>
      </footer>
    </div>
  );
}

export default TabelaProdutos;
