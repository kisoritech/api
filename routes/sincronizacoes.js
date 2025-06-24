const express = require("express");
const router = express.Router();
const db = require("../models/db");

// 🔹 GET: listar todas as sincronizações de um usuário
router.get("/", async (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) return res.status(400).json({ erro: "Usuário não informado." });

  try {
    const [rows] = await db.query(
      "SELECT * FROM sincronizacoes WHERE usuario_id = ? ORDER BY data DESC",
      [usuario_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar sincronizações:", err);
    res.status(500).json({ erro: "Erro ao buscar sincronizações" });
  }
});

// 🔸 POST: registrar nova sincronização pendente
router.post("/", async (req, res) => {
  const { tipo_dado, id_dado, usuario_id } = req.body;

  if (!tipo_dado || !id_dado || !usuario_id) {
    return res.status(400).json({ erro: "Dados incompletos." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO sincronizacoes (tipo_dado, id_dado, usuario_id, status, data) VALUES (?, ?, ?, 'pendente', NOW())",
      [tipo_dado, id_dado, usuario_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Erro ao registrar sincronização:", err);
    res.status(500).json({ erro: "Erro ao registrar sincronização" });
  }
});

// 🔁 PUT: atualizar status de sincronização
router.put("/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) return res.status(400).json({ erro: "Status obrigatório." });

  try {
    const [result] = await db.query(
      "UPDATE sincronizacoes SET status = ?, data = NOW() WHERE id = ?",
      [status, id]
    );
    res.json({ mensagem: "Status atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ erro: "Erro ao atualizar sincronização" });
  }
});

module.exports = router;