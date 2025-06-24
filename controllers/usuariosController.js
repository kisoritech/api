const db = require("../models/db");
const bcrypt = require("bcrypt");

// Criar usuário com senha criptografada
const criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  try {
    const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (usuarios.length > 0) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }

    const hash = await bcrypt.hash(senha, 10);
    await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hash]
    );

    res.status(201).json({ mensagem: "Usuário criado com sucesso." });
  } catch (erro) {
    console.error("Erro ao criar usuário:", erro);
    res.status(500).json({ erro: "Erro interno ao criar usuário." });
  }
};

// Listar todos os usuários
const listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query("SELECT id, nome, email FROM usuarios");
    res.status(200).json(usuarios);
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
};

// Atualizar usuário
const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  try {
    await db.query(
      "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?",
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
    await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.status(200).json({ mensagem: "Usuário deletado com sucesso." });
  } catch (erro) {
    console.error("Erro ao deletar usuário:", erro);
    res.status(500).json({ erro: "Erro ao deletar usuário." });
  }
};

// Exportação correta das funções
module.exports = {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario
};