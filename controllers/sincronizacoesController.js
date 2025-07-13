const db = require("../models/db");

// GET /api/sincronizacoes?usuario_id=4
exports.listar = async (req, res) => {
  const { usuario_id } = req.query;

  try {
    const result = await db.query(
      `SELECT * FROM sincronizacoes 
       WHERE usuario_id = $1 
       ORDER BY data DESC`,
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar sincronizações:", err);
    res.status(500).json({ erro: "Erro ao buscar sincronizações" });
  }
};

// POST /api/sincronizacoes
exports.registrar = async (req, res) => {
  const {
    tipo_dado,
    id_dado,
    acao,
    status = "pendente",
    origem = "web",
    usuario_id
  } = req.body;

  if (!tipo_dado || !id_dado || !acao || !usuario_id) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
  }

  try {
    const result = await db.query(
      `INSERT INTO sincronizacoes 
       (tipo_dado, id_dado, acao, status, origem, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [tipo_dado, id_dado, acao, status, origem, usuario_id]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Erro ao registrar sincronização:", err);
    res.status(500).json({ erro: "Erro ao registrar sincronização" });
  }
};

// PUT /api/sincronizacoes/:id
exports.atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ erro: "Status ausente" });
  }

  try {
    await db.query(
      `UPDATE sincronizacoes 
       SET status = $1 
       WHERE id = $2`,
      [status, id]
    );

    res.status(200).json({ mensagem: "Status atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar status da sincronização:", err);
    res.status(500).json({ erro: "Erro ao atualizar status" });
  }
};

