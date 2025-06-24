const express = require("express");
const router = express.Router();
const db = require("../models/db");
const controller = require("../controllers/transacoesController");

router.post("/", controller.criarTransacao);

// 🟢 Coloque esta rota antes da rota geral GET "/"
router.get("/:id", async (req, res) => {
  const transacaoId = req.params.id;

  try {
    const [[transacao]] = await db.query(
      "SELECT * FROM transacoes WHERE id = ?",
      [transacaoId]
    );

    if (!transacao) {
      return res.status(404).json({ erro: "Transação não encontrada" });
    }

    const [produtos] = await db.query(
      `SELECT tp.*, p.nome AS nome_produto 
       FROM transacao_produtos tp
       JOIN produtos p ON tp.produto_id = p.id
       WHERE tp.transacao_id = ?`,
      [transacaoId]
    );

    transacao.produtos = produtos;

    res.json(transacao);
  } catch (err) {
    console.error("Erro ao buscar transação:", err);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// ⬇️ DEPOIS a rota geral
router.get("/", controller.listarTransacoes);


module.exports = router;