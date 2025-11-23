import React, { useEffect, useState } from "react";
import "../App.css";
import { getProdutos, salvarProduto } from "../utils/storage";

function TabelaProdutos({ usuarioId }) {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
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

  const [filtroAberto, setFiltroAberto] = useState(false);

  useEffect(() => {
    if (usuarioId) {
      const lista = getProdutos(usuarioId);
      setProdutos(lista);
      setProdutosFiltrados(lista);
    }
  }, [usuarioId]);

  const aplicarFiltro = (tipo) => {
    let filtrado = [...produtos];

    switch (tipo) {
      case "maior":
        filtrado.sort((a, b) =>
          Number(a.valor.replace(/\D/g, "")) < Number(b.valor.replace(/\D/g, "")) ? 1 : -1
        );
        break;

      case "menor":
        filtrado.sort((a, b) =>
          Number(a.valor.replace(/\D/g, "")) > Number(b.valor.replace(/\D/g, "")) ? 1 : -1
        );
        break;

      case "uso":
        filtrado = filtrado.filter((p) => p.condicao === "em uso");
        break;

      case "armazenado":
        filtrado = filtrado.filter((p) => p.condicao === "armazenado");
        break;

      case "descartado":
        filtrado = filtrado.filter((p) => p.condicao === "descartado");
        break;

      default:
        filtrado = produtos;
    }

    setProdutosFiltrados(filtrado);
    setFiltroAberto(false);
  };

  const resetFiltro = () => {
    setProdutosFiltrados(produtos);
    setFiltroAberto(false);
  };

  const abrirModal = () => {
    setProduto({
      id: "",
      descricao: "",
      valor: "",
      condicao: "em uso",
      localizacao: "",
      aquisicao: "",
    });
    setErro("");
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setErro("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    const novaLista = [...produtos, novo];

    setProdutos(novaLista);
    setProdutosFiltrados(novaLista);

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
          <button className="button" onClick={() => setFiltroAberto(true)}>Filtrar</button>
        </aside>

        <main className="tabela-main">
          <div className="main-content">
            <h2>Produtos</h2>

            <table className="produtos-table produtos-fixa">
              <thead>
                <tr>
                  <th style={{ width: "18px" }}>ID</th>
                  <th style={{ width: "180px" }}>Descrição</th>
                  <th style={{ width: "180px" }}>Valor</th>
                  <th style={{ width: "180px" }}>Condição</th>
                  <th style={{ width: "180px" }}>Localização</th>
                  <th style={{ width: "180px" }}>Aquisição</th>
                </tr>
              </thead>

              <tbody>
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((p) => (
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

            {/* MODAL DE CADASTRAR */}
            {modalAberto && (
              <div className="modal-overlay">
                <div className="modal-card">
                  <h3>Novo Produto</h3>

                  {erro && <div className="error">{erro}</div>}

                  <div className="form">
                    <input className="input" type="text" name="id" placeholder="ID do Produto" value={produto.id} onChange={handleChange} />
                    <input className="input" type="text" name="descricao" placeholder="Descrição" maxLength={120} value={produto.descricao} onChange={handleChange} />
                    <input className="input" type="text" name="valor" placeholder="Valor (R$)" value={produto.valor} onChange={handleChange} />
                    <select className="input" name="condicao" value={produto.condicao} onChange={handleChange}>
                      <option value="em uso">Em uso</option>
                      <option value="armazenado">Armazenado</option>
                      <option value="descartado">Descartado</option>
                    </select>
                    <input className="input" type="text" name="localizacao" placeholder="Localização" maxLength={120} value={produto.localizacao} onChange={handleChange} />
                    <input className="input" type="date" name="aquisicao" value={produto.aquisicao} onChange={handleChange} />
                  </div>

                  <div style={{ marginTop: "10px", textAlign: "right" }}>
                    <button className="button" onClick={salvar}>Salvar</button>
                    <button className="button cancel-button" onClick={fecharModal}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL DE FILTRO */}
            {filtroAberto && (
              <div className="modal-overlay">
                <div className="modal-card">
                  <h3>Filtrar Produtos</h3>

                  <div className="form">
                    <button className="button" onClick={() => aplicarFiltro("maior")}>Maior Valor</button>
                    <button className="button" onClick={() => aplicarFiltro("menor")}>Menor Valor</button>
                    <button className="button" onClick={() => aplicarFiltro("uso")}>Produtos em uso</button>
                    <button className="button" onClick={() => aplicarFiltro("armazenado")}>Produtos armazenados</button>
                    <button className="button" onClick={() => aplicarFiltro("descartado")}>Produtos descartados</button>
                  </div>

                  <div style={{ marginTop: "10px", textAlign: "right" }}>
                    <button className="button" onClick={resetFiltro}>Limpar filtro</button>
                    <button className="button cancel-button" onClick={() => setFiltroAberto(false)}>Fechar</button>
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
