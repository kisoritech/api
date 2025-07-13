const express = require("express");
const router = express.Router();
const dadosController = require("../controllers/dadosController");

router.get("/", dadosController.getResumoGeral);
router.get("/financeiro/resumo", dadosController.getResumoFinanceiroPorPeriodo);
router.get("/financeiro/csv", dadosController.exportarMovimentacoesCSV);
router.get("/financeiro/categorias", dadosController.getResumoPorCategoria);

module.exports = router;


