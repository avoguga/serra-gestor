const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Inicia a aplicação Express
const app = express();

// Configurações básicas de middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --------------------------------------------------------
// 1) Credenciais “mockadas” e token fictício
// --------------------------------------------------------
const MOCK_USERNAME = "admin";
const MOCK_PASSWORD = "admin";
const MOCK_TOKEN = "fake-token-12345";

// --------------------------------------------------------
// 2) Rota de Login (POST /login)
//    - Verifica se user/senha == admin/admin
//    - Retorna JSON com { token } se sucesso
// --------------------------------------------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Tentando login com:", username, password);

  if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
    // Sucesso: retorna um token fictício
    return res.json({
      success: true,
      token: MOCK_TOKEN,
      message: "Login efetuado com sucesso!",
    });
  } else {
    // Falha: retorna 401 (Unauthorized)
    return res.status(401).json({
      success: false,
      message: "Credenciais inválidas.",
    });
  }
});

// --------------------------------------------------------
// 3) Middleware para checar token
//    - Lê cabeçalho Authorization: "Bearer fake-token-12345"
//    - Se o token não for MOCK_TOKEN, responde 401
// --------------------------------------------------------
function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  // Exemplo de authHeader: "Bearer fake-token-12345"
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

// --------------------------------------------------------
// 4) Rota protegida (por exemplo, /index.html)
//    - Para acessar /index.html, o front-end deve enviar o token no cabeçalho
//      Authorization: Bearer fake-token-12345
// --------------------------------------------------------
app.get("/index.html", checkToken, (req, res) => {
  // Serve o arquivo "index.html" do diretório public
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// --------------------------------------------------------
// 5) Demais rotas do seu projeto (rotas de eventos, etc.)
// --------------------------------------------------------
const eventosRoutes = require("./routes/eventosRoutes");
app.use("/api", eventosRoutes);

// Rotas de predição (se aplicável)
const imagePredictionRoutes = require("./routes/imagePredictionRoutes");
app.use("/api", imagePredictionRoutes);

// --------------------------------------------------------
// 6) Conexão com banco de dados (se necessário)
// --------------------------------------------------------
const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Database synced without force.");
});

// Rota básica para teste
app.get("/", (req, res) => {
  res.send("API de eventos funcionando!");
});

// --------------------------------------------------------
// 7) Inicia o servidor
// --------------------------------------------------------
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
