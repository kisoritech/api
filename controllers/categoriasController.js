const db = require("../models/db");

// LISTAR
exports.listarCategorias = async (req, res) => {
  const [categorias] = await db.query("SELECT * FROM categorias");
  res.json(categorias);
};

// CRIAR
exports.criarCategoria = async (req, res) => {
  const { nome, descricao, criado_por, atualizado_por } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO categorias (nome, descricao, criado_por, atualizado_por)
      VALUES (?, ?, ?, ?)`,
      [nome, descricao, criado_por, atualizado_por]
    );

    res.status(201).json({ id: result.insertId, nome });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ erro: "Erro ao criar categoria" });
  }
};

// ATUALIZAR
exports.atualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, atualizado_por } = req.body;

  try {
    await db.query(`
      UPDATE categorias SET nome = ?, descricao = ?, atualizado_por = ?
      WHERE id = ?`,
      [nome, descricao, atualizado_por, id]
    );

    res.json({ mensagem: "Categoria atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ erro: "Erro ao atualizar categoria" });
  }
};

// DELETAR
exports.deletarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM categorias WHERE id = ?", [id]);
    res.json({ mensagem: "Categoria deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    res.status(500).json({ erro: "Erro ao deletar categoria" });
  }
};
