const db = require("../models/db");

exports.criarTransacao = async (req, res) => {
  const { tipo, produtos, observacao, usuario_id } = req.body;

  console.log("Dados recebidos:", req.body);

  if (!tipo || !produtos || produtos.length === 0) {
    console.log("Erro: tipo ou produtos faltando");
    return res.status(400).json({ erro: "Tipo e produtos são obrigatórios." });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Cria a transação principal
    const [transacaoResult] = await conn.query(
      "INSERT INTO transacoes (tipo, observacao, usuario_id) VALUES (?, ?, ?)",
      [tipo, observacao, usuario_id]
    );

    const transacaoId = transacaoResult.insertId;

    // 2. Insere os produtos na tabela intermediária
    for (const item of produtos) {
      const { produto_id, quantidade, preco_unitario } = item;

      await conn.query(
        "INSERT INTO transacao_produtos (transacao_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
        [transacaoId, produto_id, quantidade, preco_unitario]
      );

      // 3. Atualiza o estoque no produto
      const operacao = tipo === "entrada" ? "+" : "-";
      await conn.query(
        `UPDATE produtos SET estoque_atual = estoque_atual ${operacao} ? WHERE id = ?`,
        [quantidade, produto_id]
      );
    }

    await conn.commit();
    res.status(201).json({ mensagem: "Transação criada com sucesso." });

  } catch (erro) {
    await conn.rollback();
    console.error("Erro ao criar transação:", erro);
    res.status(500).json({ erro: "Erro ao criar transação." });
  } finally {
    conn.release();
  }
};

exports.listarTransacoes = async (req, res) => {
  try {
    const [transacoes] = await db.query(`
      SELECT t.id, t.tipo, t.observacao, t.usuario_id, t.data,
             p.nome AS produto_nome, tp.quantidade, tp.preco_unitario
      FROM transacoes t
      JOIN transacao_produtos tp ON tp.transacao_id = t.id
      JOIN produtos p ON p.id = tp.produto_id
      ORDER BY t.data DESC
    `);

    res.json(transacoes);
  } catch (erro) {
    console.error("Erro ao listar transações:", erro);
    res.status(500).json({ erro: "Erro ao buscar transações." });
  }
};
