import pool from '../../lib/db';

export default async function handler(req, res) {
    // Configuração CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://sistema-patrimonio.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                return await handleGet(req, res);

            case 'POST':
                return await handlePost(req, res);

            case 'PUT':
                return await handlePut(req, res);

            case 'DELETE':
                return await handleDelete(req, res);

            default:
                return res.status(405).json({ erro: 'Método não permitido.' });
        }
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno no servidor.', detalhe: error.message });
    }
}

// GET /api/produtos?usuario_id=1
async function handleGet(req, res) {
    const { usuario_id } = req.query;

    if (!usuario_id) {
        return res.status(400).json({ erro: 'usuario_id é obrigatório.' });
    }

    const result = await pool.query(
        'SELECT * FROM produtos WHERE usuario_id = $1 ORDER BY id DESC',
        [usuario_id]
    );

    return res.status(200).json(result.rows);
}

// POST /api/produtos
async function handlePost(req, res) {
    const { nome, valor, status, localizacao, aquisicao, usuario_id } = req.body;

    if (!nome || !valor || !status || !localizacao || !aquisicao || !usuario_id) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const result = await pool.query(
        `INSERT INTO produtos (nome, valor, status, localizacao, aquisicao, usuario_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nome, valor, status, localizacao, aquisicao, usuario_id]
    );

    return res.status(201).json(result.rows[0]);
}

// PUT /api/produtos
async function handlePut(req, res) {
    const { id, nome, valor, status, localizacao, aquisicao, usuario_id } = req.body;

    if (!id || !nome || !valor || !status || !localizacao || !aquisicao || !usuario_id) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const result = await pool.query(
        `UPDATE produtos
     SET nome = $1, valor = $2, status = $3, localizacao = $4, aquisicao = $5
     WHERE id = $6 AND usuario_id = $7
     RETURNING *`,
        [nome, valor, status, localizacao, aquisicao, id, usuario_id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    return res.status(200).json(result.rows[0]);
}

// DELETE /api/produtos?id=5
async function handleDelete(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ erro: 'ID do produto é obrigatório para exclusão.' });
    }

    const result = await pool.query(
        'DELETE FROM produtos WHERE id = $1 RETURNING *',
        [id]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
}
