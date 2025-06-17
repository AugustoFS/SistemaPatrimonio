import pool from '../../lib/db'; // ou o caminho correto do seu pool de conexão

export default async function handler(req, res) {
    // 🔐 CORS Headers (ajuste origin conforme necessário)
    res.setHeader('Access-Control-Allow-Origin', 'https://sistema-patrimonio-bufj9fhem-augustofss-projects.vercel.app/api/produtos');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // se usar cookies/sessão

    // ⚙️ Tratar requisição preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST: Criar produto
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

    // GET: Listar produtos por usuário
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

    // PUT: Atualizar produto
    if (req.method === 'PUT') {
        const { id, nome, valor, status, localizacao, aquisicao } = req.body;

        if (!id || !nome || !valor || !status || !localizacao || !aquisicao) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios para atualização.' });
        }

        try {
            const result = await pool.query(
                `UPDATE produtos SET nome = $1, valor = $2, status = $3, localizacao = $4, aquisicao = $5 WHERE id = $6 RETURNING *`,
                [nome, valor, status, localizacao, aquisicao, id]
            );
            return res.status(200).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar produto', detalhe: err.message });
        }
    }

    // DELETE: Remover produto
    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ erro: 'ID do produto é obrigatório para exclusão.' });
        }

        try {
            await pool.query(`DELETE FROM produtos WHERE id = $1`, [id]);
            return res.status(204).end();
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao excluir produto', detalhe: err.message });
        }
    }

    // Método não permitido
    return res.status(405).json({ erro: 'Método não permitido' });
}
