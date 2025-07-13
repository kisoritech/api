const db = require("../models/db");

// LISTAR TODOS OS PRODUTOS
exports.listarProdutos = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, 
             c.nome AS categoria_nome, 
             u1.nome AS criado_por_nome, 
             u2.nome AS atualizado_por_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN usuarios u1 ON p.criado_por = u1.id
      LEFT JOIN usuarios u2 ON p.atualizado_por = u2.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

// CRIAR NOVO PRODUTO
exports.criarProduto = async (req, res) => {
  const { nome, descricao, preco, categoria_id, criado_por, atualizado_por } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO produtos 
      (nome, descricao, preco, categoria_id, estoque_atual, criado_por, atualizado_por)
      VALUES ($1, $2, $3, $4, 0, $5, $6)
      RETURNING id
    `, [nome, descricao, preco, categoria_id, criado_por, atualizado_por]);

    res.status(201).json({ id: result.rows[0].id, nome });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ erro: "Erro ao criar produto" });
  }
};

// ATUALIZAR PRODUTO
exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria_id, atualizado_por } = req.body;

  try {
    await db.query(`
      UPDATE produtos 
      SET nome = $1, descricao = $2, preco = $3, categoria_id = $4, atualizado_por = $5
      WHERE id = $6
    `, [nome, descricao, preco, categoria_id, atualizado_por, id]);

    res.json({ mensagem: "Produto atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
};

// DELETAR PRODUTO
exports.deletarProduto = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM produtos WHERE id = $1", [id]);
    res.json({ mensagem: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ erro: "Erro ao deletar produto" });
  }
};
