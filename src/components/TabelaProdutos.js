import React, { useEffect, useState } from "react";
import "../App.css";

function TabelaProdutos({ usuarioId }) {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  const [produto, setProduto] = useState({
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
  //     BUSCAR PRODUTOS DB
  // ============================
  useEffect(() => {
    if (!usuarioId) return;

    fetch(`/api/produtos?usuario_id=${usuarioId}`)
      .then((r) => r.json())
      .then((data) => {
        setProdutos(data);
        setProdutosFiltrados(data);
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, [usuarioId]);

  // ============================
  //    FORMATAÇÃO DE INPUTS
  // ============================
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

  // ============================
  //      SALVAR NO BANCO
  // ============================
  const salvar = async () => {
    const { descricao, valor, condicao, localizacao, aquisicao } = produto;

    if (!descricao || !valor || !condicao || !localizacao || !aquisicao) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const resp = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: descricao,
          valor,
          status: condicao,
          localizacao,
          aquisicao,
          usuario_id: Number(usuarioId),
        }),
      });

      const novo = await resp.json();

      if (!resp.ok) {
        setErro(novo.erro || "Erro ao cadastrar.");
        return;
      }

      const novaLista = [...produtos, novo];
      setProdutos(novaLista);
      setProdutosFiltrados(novaLista);

      fecharModal();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setErro("Erro ao salvar produto.");
    }
  };

  // ============================
  //      TRANSFERÊNCIA / EDIÇÃO
  // ============================
  const iniciarTransferencia = () => {
    setModoTransferencia(true);
    alert("Selecione um produto na tabela para transferir/editar.");
  };

  const selecionarProdutoTransferencia = (p) => {
    if (!modoTransferencia) return;

    setProduto({
      id: p.id,
      descricao: p.nome,
      valor: p.valor,
      condicao: p.status,
      localizacao: p.localizacao,
      aquisicao: p.aquisicao,
    });

    setModalTransferencia(true);
  };

  const salvarTransferencia = async () => {
    try {
      const resp = await fetch(`/api/produtos?id=${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: produto.id,
          nome: produto.descricao,
          valor: produto.valor,
          status: produto.condicao,
          localizacao: produto.localizacao,
          aquisicao: produto.aquisicao,
          usuario_id: Number(usuarioId),
        }),
      });

      const atualizado = await resp.json();

      if (!resp.ok) {
        alert(atualizado.erro || "Erro ao atualizar");
        return;
      }

      const listaAtualizada = produtos.map((p) =>
        p.id === atualizado.id ? atualizado : p
      );

      setProdutos(listaAtualizada);
      setProdutosFiltrados(listaAtualizada);

      setModalTransferencia(false);
      setModoTransferencia(false);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao salvar transferência.");
    }
  };

  // ============================
  //       MODAL / CONTROLES
  // ============================
  const abrirModal = () => {
    setProduto({
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

  const handleSair = () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/";
  };

  // ============================
  //  (TABELA, MODAIS E RESTANTE)
  // ============================

  return (
    <div className="introducao-container">
      <header className="intro-header">
        <h2 className="intro-logo">Sistema de Patrimônios</h2>
        <button onClick={handleSair} className="logout-button">Sair</button>
      </header>

      <div className="conteudo-com-sidebar">
        <aside className="sidebar">
          <button className="button" onClick={abrirModal}>Adicionar</button>
          <button className="button" onClick={iniciarTransferencia}>Transferência</button>
        </aside>

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
                {produtosFiltrados.map((p) => (
                  <tr
                    key={p.id}
                    className={modoTransferencia ? "linha-transferencia" : ""}
                    onClick={() => selecionarProdutoTransferencia(p)}
                  >
                    <td>{p.id}</td>
                    <td>{p.nome}</td>
                    <td>{p.valor}</td>
                    <td>{p.status}</td>
                    <td>{p.localizacao}</td>
                    <td>{p.aquisicao}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* MODAL CADASTRO */}
            {modalAberto && (
              <div className="modal-overlay">
                <div className="modal-card">

                  {erro && <div className="error">{erro}</div>}

                  <div className="form">
                    <input className="input" type="text" name="descricao" placeholder="Descrição" value={produto.descricao} onChange={handleChange} />
                    <input className="input" type="text" name="valor" placeholder="Valor" value={produto.valor} onChange={handleChange} />
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

            {/* MODAL TRANSFERÊNCIA */}
            {modalTransferencia && (
              <div className="modal-overlay">
                <div className="modal-card">

                  <div className="form">
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
