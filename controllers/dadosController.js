const db = require("../models/db");
const { Parser } = require("json2csv");

// 1. Resumo geral (dashboard principal)
exports.getResumoGeral = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios) AS total_usuarios,
        (SELECT COUNT(*) FROM categorias) AS total_categorias,
        (SELECT COUNT(*) FROM produtos) AS total_produtos
    `);

    const row = resultado.rows[0];

    res.json({
      usuarios: parseInt(row.total_usuarios),
      categorias: parseInt(row.total_categorias),
      produtos: parseInt(row.total_produtos)
    });
  } catch (error) {
    console.error("Erro ao buscar dados gerais:", error);
    res.status(500).json({ erro: "Erro ao buscar resumo geral" });
  }
};

// 2. Resumo financeiro por mês e ano
exports.getResumoFinanceiroPorPeriodo = async (req, res) => {
  const { mes, ano, usuario_id } = req.query;

  if (!mes || !ano || !usuario_id) {
    return res.status(400).json({ erro: "Informe o mês, ano e usuário" });
  }

  try {
    const resultado = await db.query(`
      SELECT tipo, SUM(valor) AS total
      FROM financeiro
      WHERE EXTRACT(MONTH FROM data) = $1
        AND EXTRACT(YEAR FROM data) = $2
        AND usuario_id = $3
      GROUP BY tipo
    `, [mes, ano, usuario_id]);

    const resumo = { receitas: 0, despesas: 0 };

    resultado.rows.forEach(row => {
      if (row.tipo === 'receita') resumo.receitas = parseFloat(row.total);
      if (row.tipo === 'despesa') resumo.despesas = parseFloat(row.total);
    });

    resumo.saldo = resumo.receitas - resumo.despesas;

    res.json(resumo);
  } catch (error) {
    console.error("Erro no resumo por período:", error);
    res.status(500).json({ erro: "Erro ao buscar resumo financeiro" });
  }
};

// 3. Exportar movimentações em CSV
exports.exportarMovimentacoesCSV = async (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ erro: "Informe o ID do usuário" });
  }

  try {
    const resultado = await db.query(
      "SELECT * FROM financeiro WHERE usuario_id = $1 ORDER BY data DESC",
      [usuario_id]
    );

    const parser = new Parser();
    const csv = parser.parse(resultado.rows);

    res.header("Content-Type", "text/csv");
    res.attachment("movimentacoes.csv");
    res.send(csv);
  } catch (error) {
    console.error("Erro ao exportar CSV:", error);
    res.status(500).json({ erro: "Erro ao exportar movimentações" });
  }
};

// 4. Relatório por categoria financeira
exports.getResumoPorCategoria = async (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ erro: "Informe o ID do usuário" });
  }

  try {
    const resultado = await db.query(`
      SELECT categoria_financeira, SUM(valor) AS total
      FROM financeiro
      WHERE usuario_id = $1
      GROUP BY categoria_financeira
      ORDER BY total DESC
    `, [usuario_id]);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Erro no resumo por categoria:", error);
    res.status(500).json({ erro: "Erro ao buscar resumo por categoria" });
  }
};

