const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");

router.get("/", categoriasController.listarCategorias);    // Corrigido aqui
router.post("/", categoriasController.criarCategoria);     // Corrigido aqui

module.exports = router;
