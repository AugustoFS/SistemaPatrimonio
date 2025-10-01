import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import "./App.css";

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
            return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
        }

        try {
            // Verificar se usuário já existe
            const existe = await pool.query('SELECT 1 FROM usuarios WHERE email = $1', [email]);
            if (existe.rowCount > 0) {
                return res.status(409).json({ erro: 'Usuário já cadastrado.' });
            }

            const hash = await bcrypt.hash(senha, 10);

            const result = await pool.query(
                'INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING id',
                [email, hash]
            );

            res.status(201).json({ usuario_id: result.rows[0].id });
        } catch (err) {
            console.error('Erro ao cadastrar usuário:', err);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }

    } else if (req.method === 'GET') {
        const { email, senha } = req.query;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
        }

        try {
            const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

            if (result.rows.length === 0) {
                // Usuário não encontrado
                return res.status(401).json({ autenticado: false, erro: 'Credenciais inválidas.' });
            }

            const usuario = result.rows[0];
            const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

            if (senhaCorreta) {
                res.status(200).json({ autenticado: true, usuario_id: usuario.id });
            } else {
                res.status(401).json({ autenticado: false, erro: 'Credenciais inválidas.' });
            }
        } catch (err) {
            console.error('Erro ao buscar usuário:', err);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }

    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ erro: `Método ${req.method} não permitido.` });
    }
}
