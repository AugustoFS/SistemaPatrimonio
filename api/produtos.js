import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {

    // CORS para frontend hospedado no Vercel
    res.setHeader("Access-Control-Allow-Origin", "https://sistema-patrimonio.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Resposta rápida para preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        // 🔥 Normalização do usuario_id
        // Aceita: ?usuario_id= / ?usuarioId= / body.usuario_id / body.usuarioId
        const usuario_id =
            req.query.usuario_id ||
            req.query.usuarioId ||
            req.body?.usuario_id ||
            req.body?.usuarioId;

        // ============================================================
        // GET → Buscar produtos do usuário
        // ============================================================
        if (req.method === "GET") {

            if (!usuario_id) {
                return res.status(400).json({ erro: "usuario_id é obrigatório na query (?usuario_id=)" });
            }

            const result = await pool.query(
                "SELECT * FROM produtos WHERE usuario_id = $1 ORDER BY id DESC",
                [usuario_id]
            );

            return res.status(200).json(result.rows);
        }

        // ============================================================
        // POST → Criar novo produto
        // ============================================================
        if (req.method === "POST") {
            const { nome, valor, status, localizacao, aquisicao } = req.body;

            if (!usuario_id || !nome || !valor || !status || !localizacao || !aquisicao) {
                return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
            }

            const result = await pool.query(
                `INSERT INTO produtos (nome, valor, status, localizacao, aquisicao, usuario_id)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [nome, valor, status, localizacao, aquisicao, usuario_id]
            );

            return res.status(201).json(result.rows[0]);
        }

        // ============================================================
        // PUT → Atualizar produto
        // ============================================================
        if (req.method === "PUT") {
            const { id, nome, valor, status, localizacao, aquisicao } = req.body;

            if (!id || !usuario_id || !nome || !valor || !status || !localizacao || !aquisicao) {
                return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
            }

            const result = await pool.query(
                `UPDATE produtos
                 SET nome = $1, valor = $2, status = $3, localizacao = $4, aquisicao = $5
                 WHERE id = $6 AND usuario_id = $7
                 RETURNING *`,
                [nome, valor, status, localizacao, aquisicao, id, usuario_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ erro: "Produto não encontrado ou não pertence ao usuário" });
            }

            return res.status(200).json(result.rows[0]);
        }

        // ============================================================
        // DELETE → Remover produto
        // ============================================================
        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id || !usuario_id) {
                return res.status(400).json({ erro: "id e usuario_id são obrigatórios" });
            }

            const result = await pool.query(
                `DELETE FROM produtos WHERE id = $1 AND usuario_id = $2 RETURNING *`,
                [id, usuario_id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ erro: "Produto não encontrado ou não pertence ao usuário" });
            }

            return res.status(200).json({ mensagem: "Produto excluído com sucesso" });
        }

        // ============================================================
        // Método não permitido
        // ============================================================
        return res.status(405).json({ erro: "Método não permitido" });

    } catch (err) {
        console.error("Erro API produtos:", err);
        return res.status(500).json({ erro: "Erro interno no servidor", detalhe: err.message });
    }
}
