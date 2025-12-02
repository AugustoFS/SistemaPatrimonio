import React, { useEffect, useState } from "react";
import "../App.css";

function TabelaProdutos({ usuarioId }) {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  const [produto, setProduto] = useState({
    identificador: "",
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

  // ============================
  //     BUSCAR PRODUTOS
  // ============================
  useEffect(() => {
    if (usuarioId) {
      fetch(`/api/produtos?usuario_id=${usuarioId}`)
        .then((r) => r.json())
        .then((data) => {
          setProdutos(data);
          setProdutosFiltrados(data);
        })
        .catch((err) => console.error("Erro ao carregar produtos:", err));
    }
  }, [usuarioId]);

  // ============================
  //     EXPORTAÇÃO CSV
  // ============================
  const exportarCSV = () => {
    const linhas = [
      ["ID", "Descrição", "Valor", "Condição", "Localização", "Aquisição"],
      ...produtosFiltrados.map((p) => [
        p.identificador,
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

  // ============================
  //     FILTROS
  // ============================
  const aplicarFiltros = () => {
    let filtrado = [...produtos];

    if (filtroValor === "maior") {
      filtrado.sort((a, b) =>
        Number(a.valor.replace(/\D/g, "")) <
          Number(b.valor.replace(/\D/g, ""))
          ? 1
          : -1
      );
    }

    if (filtroValor === "menor") {
      filtrado.sort((a, b) =>
        Number(a.valor.replace(/\D/g, "")) >
          Number(b.valor.replace(/\D/g, ""))
          ? 1
          : -1
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

  const limparFiltros = () => {
    setFiltroValor("");
    setFiltroCondicao("");
    setFiltroAquisicao("");
    setProdutosFiltrados(produtos);
  };

  // ============================
  //     MODAL
  // ============================
  const abrirModal = () => {
    setModoTransferencia(false);
    setProduto({
      identificador: "",
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

  // ============================
  //     FORMATAÇÃO INPUTS
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // IDENTIFICADOR — APENAS DÍGITOS
    if (name === "identificador") {
      const apenasNumeros = value.replace(/\D/g, "");
      setProduto({ ...produto, identificador: apenasNumeros });
      return;
    }

    // VALOR — FORMATAR EM MOEDA
    if (name === "valor") {
      const numero = value.replace(/\D/g, "");
      const formatado = (Number(numero) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      setProduto({ ...produto, valor: formatado });
      return;
    }

    setProduto((prev) => ({ ...prev, [name]: value }));

  };

  // ============================
  //     SALVAR NO BANCO
  // ============================
  const salvar = async () => {
    const { identificador, descricao, valor, condicao, localizacao, aquisicao } =
      produto;

    if (!identificador || !descricao || !valor || !condicao || !localizacao || !aquisicao) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const resp = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identificador,
          descricao,
          valor,
          condicao,
          localizacao,
          aquisicao,
          usuario_id: usuarioId,
        }),
      });

      if (!resp.ok) {
        setErro("Erro ao cadastrar produto.");
        return;
      }

      const novoProduto = await resp.json();

      const novaLista = [...produtos, novoProduto];
      setProdutos(novaLista);
      setProdutosFiltrados(novaLista);

      fecharModal();
    } catch (err) {
      console.error(err);
      setErro("Erro ao salvar produto.");
    }
  };

  // ============================
  //     TRANSFERÊNCIA / EDIÇÃO
  // ============================
  const iniciarTransferencia = () => {
    setModoTransferencia(true);
    alert("Selecione um produto na tabela para editar/transferir.");
  };

  const selecionarProdutoTransferencia = (p) => {
    if (!modoTransferencia) return;
    setProduto(p);
    setModalTransferencia(true);
  };

  const salvarTransferencia = async () => {
    try {
      const resp = await fetch(`/api/produtos?id=${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...produto, usuario_id: usuarioId }),
      });

      const atualizado = await resp.json();

      const listaAtualizada = produtos.map((p) =>
        p.id === atualizado.id ? atualizado : p
      );

      setProdutos(listaAtualizada);
      setProdutosFiltrados(listaAtualizada);

      setModalTransferencia(false);
      setModoTransferencia(false);
    } catch (err) {
      alert("Erro ao salvar transferência.");
    }
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
        {/* SIDEBAR */}
        <aside className="sidebar">
          <button className="button" onClick={abrirModal}>
            Adicionar
          </button>
          <button className="button" onClick={iniciarTransferencia}>
            Transferência
          </button>
          <button className="button" onClick={() => setFiltroAberto(true)}>
            Filtrar
          </button>
          <button className="button" onClick={exportarCSV}>
            Exportar
          </button>
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
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((p) => (
                    <tr
                      key={p.id}
                      className={modoTransferencia ? "linha-transferencia" : ""}
                      onClick={() => selecionarProdutoTransferencia(p)}
                    >
                      <td>{p.identificador}</td>
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
                    <input
                      className="input"
                      type="text"
                      name="identificador"
                      placeholder="Identificador (somente números)"
                      value={produto.identificador}
                      onChange={handleChange}
                    />

                    <input
                      className="input"
                      type="text"
                      name="descricao"
                      placeholder="Descrição"
                      value={produto.descricao}
                      onChange={handleChange}
                    />

                    <input
                      className="input"
                      type="text"
                      name="valor"
                      placeholder="Valor (R$)"
                      value={produto.valor}
                      onChange={handleChange}
                    />

                    <select
                      className="input"
                      name="condicao"
                      value={produto.condicao}
                      onChange={handleChange}
                    >
                      <option value="em uso">Em uso</option>
                      <option value="armazenado">Armazenado</option>
                      <option value="descartado">Descartado</option>
                    </select>

                    <input
                      className="input"
                      type="text"
                      name="localizacao"
                      placeholder="Localização"
                      value={produto.localizacao}
                      onChange={handleChange}
                    />

                    <input
                      className="input"
                      type="date"
                      name="aquisicao"
                      value={produto.aquisicao}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="modal-botoes">
                    <button className="button" onClick={salvar}>
                      Salvar
                    </button>
                    <button className="button cancel-button" onClick={fecharModal}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL TRANSFERÊNCIA */}
            {modalTransferencia && (
              <div className="modal-overlay">
                <div className="modal-card">
                  <div className="form">
                    <input
                      className="input"
                      type="text"
                      name="identificador"
                      value={produto.identificador}
                      onChange={handleChange}
                    />
                    <input
                      className="input"
                      type="text"
                      name="descricao"
                      value={produto.descricao}
                      onChange={handleChange}
                    />
                    <input
                      className="input"
                      type="text"
                      name="valor"
                      value={produto.valor}
                      onChange={handleChange}
                    />
                    <select
                      className="input"
                      name="condicao"
                      value={produto.condicao}
                      onChange={handleChange}
                    >
                      <option value="em uso">Em uso</option>
                      <option value="armazenado">Armazenado</option>
                      <option value="descartado">Descartado</option>
                    </select>
                    <input
                      className="input"
                      type="text"
                      name="localizacao"
                      value={produto.localizacao}
                      onChange={handleChange}
                    />
                    <input
                      className="input"
                      type="date"
                      name="aquisicao"
                      value={produto.aquisicao}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="modal-botoes">
                    <button className="button" onClick={salvarTransferencia}>
                      Salvar Transferência
                    </button>
                    <button
                      className="button cancel-button"
                      onClick={() => setModalTransferencia(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL FILTROS */}
            {filtroAberto && (
              <div className="modal-overlay">
                <div className="modal-card">
                  {/* ... filtros iguais ao seu código original ... */}

                  <div className="modal-botoes">
                    <button className="button" onClick={limparFiltros}>
                      Limpar Filtros
                    </button>
                    <button className="button" onClick={aplicarFiltros}>
                      Aplicar Filtros
                    </button>
                    <button
                      className="button cancel-button"
                      onClick={() => setFiltroAberto(false)}
                    >
                      Sair
                    </button>
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
