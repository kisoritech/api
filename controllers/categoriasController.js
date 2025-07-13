const db = require("../models/db");

// LISTAR
exports.listarCategorias = async (req, res) => {
  try {
    const resultado = await db.query("SELECT * FROM categorias");
    res.json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    res.status(500).json({ erro: "Erro ao listar categorias" });
  }
};

// CRIAR
exports.criarCategoria = async (req, res) => {
  const { nome, descricao, criado_por, atualizado_por } = req.body;

  try {
    const resultado = await db.query(
      `INSERT INTO categorias (nome, descricao, criado_por, atualizado_por)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [nome, descricao, criado_por, atualizado_por]
    );

    res.status(201).json({ id: resultado.rows[0].id, nome });
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
    await db.query(
      `UPDATE categorias SET nome = $1, descricao = $2, atualizado_por = $3 WHERE id = $4`,
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
    await db.query("DELETE FROM categorias WHERE id = $1", [id]);
    res.json({ mensagem: "Categoria deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    res.status(500).json({ erro: "Erro ao deletar categoria" });
  }
};

