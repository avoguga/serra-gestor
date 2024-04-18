const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { eventos } = require("./models");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = require("./models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  insertTestData(); // Chama a função para inserir dados de teste
});

function insertTestData() {
  db.eventos
    .bulkCreate([
      {
        Title: "Conferência de Tecnologia",
        Mes: "Março",
        DescriptionPT:
          "Uma conferência sobre as últimas tendências tecnológicas.",
        DescriptionEN: "A conference about the latest technology trends.",
        Span: "3 dias",
        Data: new Date(2023, 2, 15), // 15 de Março de 2023
      },
      {
        Title: "Workshop de Arte",
        Mes: "Abril",
        DescriptionPT:
          "Um workshop interativo sobre técnicas modernas de pintura.",
        DescriptionEN: "An interactive workshop on modern painting techniques.",
        Span: "2 dias",
        Data: new Date(2023, 3, 10), // 10 de Abril de 2023
      },
      {
        Title: "Festival de Música",
        Mes: "Maio",
        DescriptionPT: "Festival celebrando diversos gêneros musicais.",
        DescriptionEN: "Festival celebrating various music genres.",
        Span: "5 dias",
        Data: new Date(2023, 4, 20), // 20 de Maio de 2023
      },
    ])
    .then(() => {
      console.log("Dados de teste inseridos.");
    })
    .catch((error) => {
      console.error("Erro ao inserir dados de teste:", error);
    });
}

// Endpoint para buscar todos os eventos
app.get("/api/agendas", async (req, res) => {
  try {
    const allEvents = await db.eventos.findAll();
    const eventosMapeados = allEvents.map((evento) => ({
      id: evento.id,
      Title: evento.Title,
      Mes: evento.Mes.toLowerCase(),
      DescriptionPT: evento.DescriptionPT,
      Data: new Date(evento.Data),
    }));
    res.json({ data: eventosMapeados });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).send(error.message);
  }
});

// Endpoint para buscar um evento específico pelo ID
app.get("/api/agendas/:id", async (req, res) => {
  try {
    const evento = await db.eventos.findByPk(req.params.id);
    if (evento) {
      const eventoData = {
        id: evento.id,
        Title: evento.Title,
        Month: evento.Mes,
        DescriptionPT: evento.DescriptionPT,
        DescriptionEN: evento.DescriptionEN,
        Span: evento.Span,
        Data: new Date(evento.Data),
      };
      res.json({ data: eventoData });
    } else {
      res.status(404).send("Evento não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do evento:", error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 1337;

app.get("/", (req, res) => res.send("Api de eventos!"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
