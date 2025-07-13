const db = require("../models/db");
const bcrypt = require("bcrypt");

// Criar usuário com senha criptografada
const criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  try {
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }

    const hash = await bcrypt.hash(senha, 10);
    const insertResult = await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
      [nome, email, hash]
    );

    res.status(201).json({ mensagem: "Usuário criado com sucesso.", id: insertResult.rows[0].id });
  } catch (erro) {
    console.error("Erro ao criar usuário:", erro);
    res.status(500).json({ erro: "Erro interno ao criar usuário." });
  }
};

// Listar todos os usuários
const listarUsuarios = async (req, res) => {
  try {
    const result = await db.query("SELECT id, nome, email FROM usuarios ORDER BY nome");
    res.status(200).json(result.rows);
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
};

// Buscar usuário por ID
const buscarUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await db.query("SELECT id, nome, email FROM usuarios WHERE id = $1", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar usuário:", erro);
    res.status(500).json({ erro: "Erro ao buscar usuário." });
  }
};

// Atualizar usuário
const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios." });
  }

  try {
    await db.query(
      "UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3",
      [nome, email, id]
    );
    res.status(200).json({ mensagem: "Usuário atualizado com sucesso." });
  } catch (erro) {
    console.error("Erro ao atualizar usuário:", erro);
    res.status(500).json({ erro: "Erro ao atualizar usuário." });
  }
};

// Deletar usuário
const deletarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.status(200).json({ mensagem: "Usuário deletado com sucesso." });
  } catch (erro) {
    console.error("Erro ao deletar usuário:", erro);
    res.status(500).json({ erro: "Erro ao deletar usuário." });
  }
};

module.exports = {
  criarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  deletarUsuario
};

