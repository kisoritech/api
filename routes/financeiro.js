const express = require("express");
const router = express.Router();
const controller = require("../controllers/financeiroController");

router.get("/", controller.listarMovimentacoes);
router.post("/", controller.criarMovimentacao);

module.exports = router;
