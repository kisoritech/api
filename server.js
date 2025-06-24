// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const dadosRoutes = require("./routes/dados");
const usuariosRoutes = require("./routes/usuarios");
const categoriasRoutes = require("./routes/categorias");
const produtosRoutes = require("./routes/produtos");
const transacoesRoutes = require("./routes/transacoes");
const financeiroRoutes = require("./routes/financeiro");
const loginRoutes = require("./routes/login");
const sincronizacoesRoutes = require("./routes/sincronizacoes");

app.use("/api/dados", dadosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/transacoes", transacoesRoutes);
app.use("/api/financeiro", financeiroRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/sincronizacoes", sincronizacoesRoutes);

// 🔄 Ponto de integração futura com APP Cordova e Executável Flask:
// Tanto o aplicativo Cordova quanto o executável Flask poderão acessar estas rotas via HTTP.
// Exemplo de uso no app: fetch('http://<ip_ou_dominio>:3000/api/produtos')
// Exemplo no Flask (requests): requests.get('http://<ip_ou_dominio>:3000/api/produtos')

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("🚀 API rodando! Use as rotas começando com /api/");
});
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
