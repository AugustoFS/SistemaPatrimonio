import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "https://sistema-patrimonio.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // ➤ CADASTRO (POST)
    if (req.method === "POST") {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios." });
        }

        try {
            // evitar duplicidade
            const check = await pool.query(
                "SELECT 1 FROM usuarios WHERE email = $1",
                [email]
            );

            if (check.rowCount > 0) {
                return res.status(409).json({ erro: "Usuário já cadastrado." });
            }

            const hash = await bcrypt.hash(senha, 10);

            const result = await pool.query(
                "INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING id",
                [email, hash]
            );

            return res.status(201).json({ usuario_id: result.rows[0].id });

        } catch (err) {
            console.error("Erro ao cadastrar usuário:", err);
            return res.status(500).json({ erro: "Erro interno no servidor." });
        }
    }

    // ➤ LOGIN (GET)
    if (req.method === "GET") {
        const { email, senha } = req.query;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios." });
        }

        try {
            const result = await pool.query(
                "SELECT * FROM usuarios WHERE email = $1",
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ autenticado: false, erro: "Credenciais inválidas." });
            }

            const usuario = result.rows[0];
            const senhaOK = await bcrypt.compare(senha, usuario.senha);

            if (!senhaOK) {
                return res.status(401).json({ autenticado: false, erro: "Credenciais inválidas." });
            }

            return res.status(200).json({
                autenticado: true,
                usuario_id: usuario.id
            });

        } catch (err) {
            console.error("Erro ao logar usuário:", err);
            return res.status(500).json({ erro: "Erro interno no servidor." });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ erro: `Método ${req.method} não permitido.` });
}
