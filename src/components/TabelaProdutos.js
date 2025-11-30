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
  const [modalTransferencia, setModalTransferencia] = useState(false);

  const [modoTransferencia, setModoTransferencia] = useState(false);

  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroCondicao, setFiltroCondicao] = useState("");
  const [filtroAquisicao, setFiltroAquisicao] = useState("");

  useEffect(() => {
    if (usuarioId) {
      const lista = getProdutos(usuarioId);
      setProdutos(lista);
      setProdutosFiltrados(lista);
    }
  }, [usuarioId]);

  // EXPORTAÇÃO CSV
  const exportarCSV = () => {
    const linhas = [
      ["ID", "Descrição", "Valor", "Condição", "Localização", "Aquisição"],
      ...produtosFiltrados.map((p) => [
        p.id,
        p.descricao,
        p.valor,
        p.condicao,
        p.localizacao,
        p.aquisicao,
      ]),
    ];

    const conteudo = linhas.map((l) => l.join(";")).join("\n");
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "produtos.csv";
    link.click();
  };

  // APLICAR FILTROS
  const aplicarFiltros = () => {
    let filtrado = [...produtos];

    if (filtroValor === "maior") {
      filtrado.sort((a, b) =>
        Number(a.valor.replace(/\D/g, "")) < Number(b.valor.replace(/\D/g, "")) ? 1 : -1
      );
    }
    if (filtroValor === "menor") {
      filtrado.sort((a, b) =>
        Number(a.valor.replace(/\D/g, "")) > Number(b.valor.replace(/\D/g, "")) ? 1 : -1
      );
    }

    if (filtroCondicao) {
      filtrado = filtrado.filter((p) => p.condicao === filtroCondicao);
    }

    if (filtroAquisicao === "recentes") {
      filtrado.sort((a, b) => (a.aquisicao < b.aquisicao ? 1 : -1));
    }
    if (filtroAquisicao === "antigos") {
      filtrado.sort((a, b) => (a.aquisicao > b.aquisicao ? 1 : -1));
    }

    setProdutosFiltrados(filtrado);
    setFiltroAberto(false);
  };

  // LIMPAR FILTROS
  const limparFiltros = () => {
    setFiltroValor("");
    setFiltroCondicao("");
    setFiltroAquisicao("");
    setProdutosFiltrados(produtos);
  };

  // MODAL ADICIONAR PRODUTO
  const abrirModal = () => {
    setModoTransferencia(false);
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
      const numero = value.replace(/\D/g, "");
      const formatado = (Number(numero) / 100).toLocaleString("pt-BR", {
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

    const novo = salvarProduto({ ...produto, usuarioId });

    const novaLista = [...produtos, novo];
    setProdutos(novaLista);
    setProdutosFiltrados(novaLista);

    fecharModal();
  };

  // MODO TRANSFERÊNCIA
  const iniciarTransferencia = () => {
    setModoTransferencia(true);
    alert("Selecione um produto na tabela para transferir/editar.");
  };

  const selecionarProdutoTransferencia = (p) => {
    if (!modoTransferencia) return;

    setProduto(p);
    setModalTransferencia(true);
  };

  const salvarTransferencia = () => {
    const listaAtualizada = produtos.map((p) =>
      p.id === produto.id ? produto : p
    );

    setProdutos(listaAtualizada);
    setProdutosFiltrados(listaAtualizada);
    setModalTransferencia(false);
    setModoTransferencia(false);
  };

  const handleSair = () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  };

  return (
    <div className="introducao-container">
      <header className="intro-header">
        <h2 className="intro-logo">Sistema de Patrimônios</h2>
        <button onClick={handleSair} className="logout-button">Sair</button>
      </header>

      <div className="conteudo-com-sidebar">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <button className="button" onClick={abrirModal}>Adicionar</button>

          <button className="button" onClick={iniciarTransferencia}>
            Transferência
          </button>

          <button className="button" onClick={() => setFiltroAberto(true)}>Filtrar</button>
          <button className="button" onClick={exportarCSV}>Exportar</button>
        </aside>

        {/* TABELA */}
        <main className="tabela-main">
          <div className="main-content">
            <h2>Produtos</h2>

            <table className="produtos-table produtos-fixa">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Condição</th>
                  <th>Localização</th>
                  <th>Aquisição</th>
                </tr>
              </thead>

              <tbody>
                {produtosFiltrados.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: "center" }}>Nenhum produto encontrado.</td></tr>
                ) : (
                  produtosFiltrados.map((p) => (
                    <tr
                      key={p.id}
                      className={modoTransferencia ? "linha-transferencia" : ""}
                      onClick={() => selecionarProdutoTransferencia(p)}
                    >
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

            {/* MODAL CADASTRO */}
            {modalAberto && (
              <div className="modal-overlay">
                <div className="modal-card">

                  {erro && <div className="error">{erro}</div>}

                  <div className="form">
                    <input className="input" type="text" name="id" placeholder="ID do Produto" value={produto.id} onChange={handleChange} />
                    <input className="input" type="text" name="descricao" placeholder="Descrição" value={produto.descricao} onChange={handleChange} />
                    <input className="input" type="text" name="valor" placeholder="Valor (R$)" value={produto.valor} onChange={handleChange} />
                    <select className="input" name="condicao" value={produto.condicao} onChange={handleChange}>
                      <option value="em uso">Em uso</option>
                      <option value="armazenado">Armazenado</option>
                      <option value="descartado">Descartado</option>
                    </select>
                    <input className="input" type="text" name="localizacao" placeholder="Localização" value={produto.localizacao} onChange={handleChange} />
                    <input className="input" type="date" name="aquisicao" value={produto.aquisicao} onChange={handleChange} />
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <button className="button" onClick={salvar}>Salvar</button>
                    <button className="button cancel-button" onClick={fecharModal}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL TRANSFERÊNCIA (EDIÇÃO SEM ALTERAR ID) */}
            {modalTransferencia && (
              <div className="modal-overlay">
                <div className="modal-card">

                  <div className="form">
                    <input className="input" type="text" name="id" value={produto.id} disabled />
                    <input className="input" type="text" name="descricao" value={produto.descricao} onChange={handleChange} />
                    <input className="input" type="text" name="valor" value={produto.valor} onChange={handleChange} />
                    <select className="input" name="condicao" value={produto.condicao} onChange={handleChange}>
                      <option value="em uso">Em uso</option>
                      <option value="armazenado">Armazenado</option>
                      <option value="descartado">Descartado</option>
                    </select>
                    <input className="input" type="text" name="localizacao" value={produto.localizacao} onChange={handleChange} />
                    <input className="input" type="date" name="aquisicao" value={produto.aquisicao} onChange={handleChange} />
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <button className="button" onClick={salvarTransferencia}>Salvar Transferência</button>
                    <button className="button cancel-button" onClick={() => setModalTransferencia(false)}>Cancelar</button>
                  </div>

                </div>
              </div>
            )}

            {/* MODAL FILTROS */}
            {filtroAberto && (
              <div className="modal-overlay">
                <div className="modal-card">

                  <div className="form" style={{ textAlign: "left" }}>

                    <h4>Valor</h4>
                    <label className="input"><input className="custom-radio" type="radio" name="valor" checked={filtroValor === "maior"} onChange={() => setFiltroValor("maior")} /> Maior valor</label>
                    <label className="input"><input className="custom-radio" type="radio" name="valor" checked={filtroValor === "menor"} onChange={() => setFiltroValor("menor")} /> Menor valor</label>

                    <h4>Condição</h4>
                    <label className="input"><input className="custom-radio" type="radio" name="condicao" checked={filtroCondicao === "em uso"} onChange={() => setFiltroCondicao("em uso")} /> Em uso</label>
                    <label className="input"><input className="custom-radio" type="radio" name="condicao" checked={filtroCondicao === "armazenado"} onChange={() => setFiltroCondicao("armazenado")} /> Armazenado</label>
                    <label className="input"><input className="custom-radio" type="radio" name="condicao" checked={filtroCondicao === "descartado"} onChange={() => setFiltroCondicao("descartado")} /> Descartado</label>

                    <h4>Aquisição</h4>
                    <label className="input"><input className="custom-radio" type="radio" name="aq" checked={filtroAquisicao === "recentes"} onChange={() => setFiltroAquisicao("recentes")} /> Mais recentes</label>
                    <label className="input"><input className="custom-radio" type="radio" name="aq" checked={filtroAquisicao === "antigos"} onChange={() => setFiltroAquisicao("antigos")} /> Mais antigos</label>
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <button className="button" onClick={limparFiltros}>Limpar Filtros</button>
                    <button className="button" onClick={aplicarFiltros}>Aplicar Filtros</button>
                    <button className="button cancel-button" onClick={() => setFiltroAberto(false)}>Sair</button>
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
