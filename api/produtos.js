import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nome, valor, status, localizacao, aquisicao, usuario_id } = req.body;

        if (!nome || !valor || !status || !localizacao || !aquisicao || !usuario_id) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
        }

        try {
            const result = await pool.query(
                `INSERT INTO produtos (nome, valor, status, localizacao, aquisicao, usuario_id)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [nome, valor, status, localizacao, aquisicao, usuario_id]
            );
            return res.status(201).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao cadastrar produto', detalhe: err.message });
        }
    }

    if (req.method === 'GET') {
        const { usuario_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({ erro: 'usuario_id é obrigatório para buscar produtos.' });
        }

        try {
            const result = await pool.query(
                `SELECT * FROM produtos WHERE usuario_id = $1 ORDER BY id DESC`,
                [usuario_id]
            );
            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar produtos', detalhe: err.message });
        }
    }

    return res.status(405).json({ erro: 'Método não permitido' });
}
