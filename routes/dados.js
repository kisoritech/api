const express = require("express");
const router = express.Router();
const dadosController = require("../controllers/dadosController");

router.get("/", dadosController.getResumoGeral);

module.exports = router;
