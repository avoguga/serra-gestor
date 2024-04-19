const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Requerir os módulos de rotas
const eventosRoutes = require("./routes/eventosRoutes");

// Configurar middlewares básicos
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Database synced without force.");
  // Se necessário, chame a função para inserir dados de teste aqui
  // Mas certifique-se de que a inserção de teste não duplique os dados a cada reinicialização.
});
// Usar as rotas de eventos definidas em outro arquivo
app.use("/api", eventosRoutes);

// Endpoint básico para verificar se a API está funcionando
app.get("/", (req, res) => res.send("Api de eventos!"));

// Configurar porta e iniciar o servidor
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
