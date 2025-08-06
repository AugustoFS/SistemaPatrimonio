import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        try {
            const hash = await bcrypt.hash(senha, 10);

            const result = await pool.query(
                'INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING id',
                [email, hash]
            );

            res.status(200).json({ usuario_id: result.rows[0].id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhe: err.message });
        }
    }

    else if (req.method === 'GET') {
        const { email, senha } = req.query;

        try {
            const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

            if (result.rows.length === 0) {
                return res.status(401).json({ autenticado: false });
            }

            const usuario = result.rows[0];
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (senhaCorreta) {
                res.status(200).json({ autenticado: true, usuario_id: usuario.id });
            } else {
                res.status(401).json({ autenticado: false });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ erro: 'Erro ao buscar usuário', detalhe: err.message });
        }
    }

    else {
        res.status(405).json({ erro: 'Método não permitido' });
    }
}
