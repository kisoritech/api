const db = require("../models/db");

exports.getResumoGeral = async (req, res) => {
  try {
    const [[usuarios]] = await db.query("SELECT COUNT(*) AS total_usuarios FROM usuarios");
    const [[categorias]] = await db.query("SELECT COUNT(*) AS total_categorias FROM categorias");
    const [[produtos]] = await db.query("SELECT COUNT(*) AS total_produtos FROM produtos");

    res.json({
      usuarios: usuarios.total_usuarios,
      categorias: categorias.total_categorias,
      produtos: produtos.total_produtos
    });
  } catch (error) {
    console.error("Erro ao buscar dados gerais:", error);
    res.status(500).json({ erro: "Erro ao buscar resumo geral" });
  }
};