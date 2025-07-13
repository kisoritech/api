const db = require("../models/db");

// Criar nova transação
exports.criarTransacao = async (req, res) => {
  const { tipo, produtos, observacao, usuario_id } = req.body;

  console.log("Dados recebidos:", req.body);

  if (!tipo || !produtos || produtos.length === 0) {
    return res.status(400).json({ erro: "Tipo e produtos são obrigatórios." });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Inserir a transação principal
    const transacaoResult = await client.query(
      `INSERT INTO transacoes (tipo, observacao, usuario_id) 
       VALUES ($1, $2, $3) RETURNING id`,
      [tipo, observacao, usuario_id]
    );

    const transacaoId = transacaoResult.rows[0].id;

    // Inserir cada produto relacionado à transação
    for (const item of produtos) {
      const { produto_id, quantidade, preco_unitario } = item;

      await client.query(
        `INSERT INTO transacao_produtos 
         (transacao_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [transacaoId, produto_id, quantidade, preco_unitario]
      );

      // Atualizar estoque
      const operacao = tipo === "entrada" ? "+" : "-";
      await client.query(
        `UPDATE produtos 
         SET estoque_atual = estoque_atual ${operacao} $1 
         WHERE id = $2`,
        [quantidade, produto_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensagem: "Transação criada com sucesso.",
      transacao_id: transacaoId
    });
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar transação:", erro);
    res.status(500).json({ erro: "Erro ao criar transação." });
  } finally {
    client.release();
  }
};

// Listar todas as transações
exports.listarTransacoes = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        t.id, t.tipo, t.observacao, t.usuario_id, t.data,
        tp.produto_id, p.nome AS produto_nome,
        tp.quantidade, tp.preco_unitario
      FROM transacoes t
      JOIN transacao_produtos tp ON tp.transacao_id = t.id
      JOIN produtos p ON p.id = tp.produto_id
      ORDER BY t.data DESC
    `);

    res.status(200).json(result.rows);
  } catch (erro) {
    console.error("Erro ao listar transações:", erro);
    res.status(500).json({ erro: "Erro ao buscar transações." });
  }
};

