const db = require("../models/db");

// LISTAR MOVIMENTAÇÕES FINANCEIRAS
exports.listarMovimentacoes = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT f.*, u.nome AS usuario_nome
      FROM financeiro f
      LEFT JOIN usuarios u ON f.usuario_id = u.id
      ORDER BY f.data DESC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar movimentações:", error);
    res.status(500).json({ erro: "Erro ao buscar movimentações financeiras" });
  }
};

// CRIAR MOVIMENTAÇÃO
exports.criarMovimentacao = async (req, res) => {
  const { descricao, tipo, valor, categoria_financeira, usuario_id } = req.body;

  try {
    await db.query(`
      INSERT INTO financeiro (descricao, tipo, valor, categoria_financeira, usuario_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [descricao, tipo, valor, categoria_financeira, usuario_id]);

    res.status(201).json({ mensagem: "Movimentação registrada com sucesso" });
  } catch (error) {
    console.error("Erro ao criar movimentação:", error);
    res.status(500).json({ erro: "Erro ao registrar movimentação" });
  }
};

