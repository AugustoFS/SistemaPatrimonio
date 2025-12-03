import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "https://sistema-patrimonio.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        if (req.method === "GET") {
            const usuario_id = req.query.usuario_id;

            if (!usuario_id) {
                return res.status(400).json({ erro: "usuario_id é obrigatório na query (?usuario_id=)" });
            }

            const result = await pool.query(
                "SELECT * FROM produtos WHERE usuario_id = $1 ORDER BY id DESC",
                [usuario_id]
            );

            return res.status(200).json(result.rows);
        }

        if (req.method === "POST") {
            const { identificador, descricao, valor, condicao, localizacao, aquisicao, usuario_id } = req.body;

            if (!usuario_id) {
                return res.status(400).json({ erro: "usuario_id é obrigatório no corpo da requisição" });
            }

            if (!identificador || !descricao || !valor || !condicao || !localizacao || !aquisicao) {
                return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
            }

            const result = await pool.query(
                `INSERT INTO produtos (identificador, descricao, valor, condicao, localizacao, aquisicao, usuario_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [identificador, descricao, valor, condicao, localizacao, aquisicao, usuario_id]
            );

            return res.status(201).json(result.rows[0]);
        }

        if (req.method === "PUT") {
            const { id, identificador, descricao, valor, condicao, localizacao, aquisicao, usuario_id } = req.body;

            if (!id || !usuario_id) {
                return res.status(400).json({ erro: "id e usuario_id são obrigatórios." });
            }

            const result = await pool.query(
                `UPDATE produtos SET 
                    identificador = $1,
                    descricao = $2,
                    valor = $3,
                    condicao = $4,
                    localizacao = $5,
                    aquisicao = $6
                 WHERE id = $7 AND usuario_id = $8
                 RETURNING *`,
                [identificador, descricao, valor, condicao, localizacao, aquisicao, id, usuario_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ erro: "Produto não encontrado." });
            }

            return res.status(200).json(result.rows[0]);
        }

        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ erro: "id é obrigatório no DELETE" });
            }

            const result = await pool.query(
                "DELETE FROM produtos WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }

            return res.status(200).json({ mensagem: "Produto removido com sucesso" });
        }

        return res.status(405).json({ erro: "Método não permitido." });

    } catch (err) {
        console.error("Erro API produtos:", err);
        return res.status(500).json({ erro: "Erro interno no servidor", detalhe: err.message });
    }
}
