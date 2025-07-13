const db = require("../models/db");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios." });
  }

  try {
    const result = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    delete usuario.senha;

    return res.status(200).json({
      mensagem: "Login bem-sucedido",
      usuario
    });

  } catch (erro) {
    console.error("Erro ao realizar login:", erro);
    return res.status(500).json({ erro: "Erro interno ao tentar fazer login." });
  }
};




