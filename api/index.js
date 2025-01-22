/**************************************************
 * index.js - Exemplo de login mockado com token
 * Usuário e senha fixos: admin / admin
 * Após login bem-sucedido, devolve token "fake-token-12345"
 * O front-end guarda este token no localStorage
 **************************************************/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Inicia a aplicação Express
const app = express();

// Middlewares básicos
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ------------------------------------------------------
// 1) Login “mockado” (admin / admin) e token fictício
// ------------------------------------------------------
const MOCK_USERNAME = "admin";
const MOCK_PASSWORD = "admin";
const MOCK_TOKEN = "fake-token-12345";

// POST /login - Verifica credenciais e retorna token se sucesso
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Tentando login com:", username, password);

  if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
    // Retorna JSON com token
    return res.json({
      success: true,
      token: MOCK_TOKEN,
      message: "Login efetuado com sucesso!",
    });
  } else {
    // Se as credenciais forem inválidas, retorna 401
    return res.status(401).json({
      success: false,
      message: "Credenciais inválidas.",
    });
  }
});

// ------------------------------------------------------
// 2) Middleware de verificação de token (checkToken)
// ------------------------------------------------------
function checkToken(req, res, next) {
  /**
   * Esperamos receber no cabeçalho:
   *  Authorization: Bearer fake-token-12345
   */
  const authHeader = req.headers["authorization"] || "";
  // Ex.: "Bearer fake-token-12345"
  const [scheme, token] = authHeader.split(" ");

  if (scheme === "Bearer" && token === MOCK_TOKEN) {
    console.log("Token válido, acesso autorizado.");
    return next();
  } else {
    return res.status(401).json({
      success: false,
      message: "Acesso não autorizado. Token inválido ou ausente.",
    });
  }
}

// ------------------------------------------------------
// 3) Servir páginas estáticas de /public
//    Assim podemos acessar /login.html, /index.html etc.
// ------------------------------------------------------
app.use(express.static(path.join(__dirname, "../public")));

// Rota GET /login (opcional) - se quiser digitar /login no navegador
// e servir exatamente o "login.html" do public
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
});

// Rota protegida de exemplo (GET /index.html)
// Exige que o cliente envie o token correto no cabeçalho "Authorization"
app.get("/index.html", checkToken, (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// ------------------------------------------------------
// 4) Rotas da sua aplicação (eventos, etc.)
// ------------------------------------------------------
const eventosRoutes = require("./routes/eventosRoutes");
const imagePredictionRoutes = require("./routes/imagePredictionRoutes");

// Usa as rotas definidas
app.use("/api", eventosRoutes);
app.use("/api", imagePredictionRoutes);

// ------------------------------------------------------
// 5) Conexão com DB (caso deseje manter)
// ------------------------------------------------------
const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Database synced without force.");
});

// Rota básica de teste
app.get("/", (req, res) => {
  res.send("API de eventos funcionando!");
});

// ------------------------------------------------------
// 6) Inicia o servidor
// ------------------------------------------------------
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
