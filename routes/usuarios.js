const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuariosController");

// Rotas de usuários
router.get("/", usuarioController.listarUsuarios);
router.post("/", usuarioController.criarUsuario);
router.put("/:id", usuarioController.atualizarUsuario);
router.delete("/:id", usuarioController.deletarUsuario);
router.get("/:id", usuarioController.buscarUsuarioPorId);


module.exports = router;