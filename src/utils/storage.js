// src/utils/storage.js
export function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

export function salvarUsuario(usuario) {
  const usuarios = getUsuarios();
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

export function getProdutos(usuarioId) {
  const todos = JSON.parse(localStorage.getItem("produtos")) || [];
  return todos.filter((p) => p.usuarioId === usuarioId);
}

export function salvarProduto(produto) {
  const todos = JSON.parse(localStorage.getItem("produtos")) || [];
  const novo = { ...produto, id: Date.now() };
  todos.push(novo);
  localStorage.setItem("produtos", JSON.stringify(todos));
  return novo;
}

export function atualizarProduto(produto) {
  const todos = JSON.parse(localStorage.getItem("produtos")) || [];
  const atualizados = todos.map((p) => (p.id === produto.id ? produto : p));
  localStorage.setItem("produtos", JSON.stringify(atualizados));
  return produto;
}

export function excluirProduto(id) {
  const todos = JSON.parse(localStorage.getItem("produtos")) || [];
  const filtrados = todos.filter((p) => p.id !== id);
  localStorage.setItem("produtos", JSON.stringify(filtrados));
}
