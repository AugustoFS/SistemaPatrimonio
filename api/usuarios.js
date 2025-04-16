// /api/usuarios.js
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necessário pro Neon
    },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, senha } = req.body;

        try {
            const result = await pool.query(
                'INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING *',
                [email, senha]
            );
            res.status(200).json({ usuario: result.rows[0] });
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhe: err.message });
        }
    } else if (req.method === 'GET') {
        const { email, senha } = req.query;

        try {
            const result = await pool.query(
                'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
                [email, senha]
            );

            if (result.rows.length > 0) {
                res.status(200).json({ autenticado: true });
            } else {
                res.status(401).json({ autenticado: false });
            }
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }
    }
}
