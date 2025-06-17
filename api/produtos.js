import pool from '../../lib/db'; // ajuste conforme a localização do seu pool

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', 'https://sistema-patrimonio.vercel.app'); // ou '*'
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        const { usuario_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({ erro: 'usuario_id é obrigatório para buscar produtos.' });
        }

        try {
            const result = await pool.query(
                'SELECT * FROM produtos WHERE usuario_id = $1 ORDER BY id DESC',
                [usuario_id]
            );
            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao buscar produtos', detalhe: err.message });
        }
    }

    if (req.method === 'POST') {
        const { nome, valor, status, localizacao, aquisicao, usuario_id } = req.body;

        if (!nome || !valor || !status || !localizacao || !aquisicao || !usuario_id) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
        }

        try {
            const result = await pool.query(
                'INSERT INTO produtos (nome, valor, status, localizacao, aquisicao, usuario_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [nome, valor, status, localizacao, aquisicao, usuario_id]
            );
            return res.status(201).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao cadastrar produto', detalhe: err.message });
        }
    }

    if (req.method === 'PUT') {
        const { id, nome, valor, status, localizacao, aquisicao, usuario_id } = req.body;

        if (!id || !nome || !valor || !status || !localizacao || !aquisicao || !usuario_id) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
        }

        try {
            const result = await pool.query(
                `UPDATE produtos 
         SET nome = $1, valor = $2, status = $3, localizacao = $4, aquisicao = $5 
         WHERE id = $6 AND usuario_id = $7 RETURNING *`,
                [nome, valor, status, localizacao, aquisicao, id, usuario_id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ erro: 'Produto não encontrado.' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao atualizar produto', detalhe: err.message });
        }
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ erro: 'ID do produto é obrigatório para exclusão.' });
        }

        try {
            const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
            if (result.rowCount === 0) {
                return res.status(404).json({ erro: 'Produto não encontrado.' });
            }
            return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
        } catch (err) {
            return res.status(500).json({ erro: 'Erro ao excluir produto', detalhe: err.message });
        }
    }

    return res.status(405).json({ erro: 'Método não permitido' });
}
