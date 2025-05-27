import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nome, valor, status, localizacao, aquisicao, usuario_id } = req.body;

        try {
            const result = await pool.query(
                `INSERT INTO produtos (nome, valor, status, localizacao, aquisicao, usuario_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [nome, valor, status, localizacao, aquisicao, usuario_id]
            );
            res.status(200).json({ produto: result.rows[0] });
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao cadastrar produto', detalhe: err.message });
        }
    } else if (req.method === 'GET') {
        const { usuario_id } = req.query;

        try {
            const result = await pool.query(
                `SELECT * FROM produtos WHERE usuario_id = $1`,
                [usuario_id]
            );
            res.status(200).json({ produtos: result.rows });
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar produtos', detalhe: err.message });
        }
    } else {
        res.status(405).json({ erro: 'Método não permitido' });
    }
}
