const express = require("express");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: "154.127.52.152",
  user: "avoguga",
  password: "50737676",
  database: "nz_serrabarriga",
  port: 3306,
};

const sessionStore = new MySQLStore(options);

// Configuração do middleware de sessão
app.use(
  session({
    secret: "segredo muito secreto",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hora em milissegundos
      httpOnly: true, // Impede o acesso ao cookie via JavaScript no navegador
      secure: true,
    },
  })
);

app.use((req, res, next) => {
  console.log(
    `Body: ${req.body}`,
    `Query: ${req.query}`,
    `Params: ${req.params}`
  );
  next();
});

// Configurar middlewares básicos
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // Para ler corpos de formulário
app.use(bodyParser.json());

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Configuração do Passport para usar estratégia Local
passport.use(
  new LocalStrategy((username, password, done) => {
    const MOCK_USERNAME = "admin";
    const MOCK_PASSWORD = "admin";

    // Verifica se as credenciais correspondem ao mock
    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
      // Cria um objeto usuário fictício para propósitos de sessão
      const user = { id: 1, username: MOCK_USERNAME };
      console.log(`Usuário autenticado (mock): ${username}`);
      return done(null, user);
    } else {
      console.log(`Falha na autenticação para o usuário: ${username}`);
      return done(null, false, { message: "Credenciais inválidas." });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Retorna o usuário mockado independentemente do ID  
  done(null, { id: 1, username: "admin" });
});


// Função para checar se o usuário está autenticado
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    // se o usuário está autenticado, continue com a próxima função na cadeia
    next();
  } else {
    // se não está autenticado, redirecione para a página de login
    res.redirect("/login");
  }
}

// Middleware para proteger a rota do index.html
app.get("/index.html", checkAuthentication, (req, res) => {
  // res.sendFile(path.join(__dirname, "public", "index.html"));
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Rota de login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

// Endpoint de login
app.post(
  "/login",
  (req, res, next) => {
    console.log(`Processando login para o usuário: ${req.body.username}`);
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/index.html",
    failureRedirect: "/login",
    failureFlash: true, // Requer 'connect-flash' se você quiser usar mensagens flash
  })
);

// Requerir os módulos de rotas
const eventosRoutes = require("./routes/eventosRoutes");

const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Database synced without force.");
  // Se necessário, chame a função para inserir dados de teste aqui
  // Mas certifique-se de que a inserção de teste não duplique os dados a cada reinicialização.
});
// Usar as rotas de eventos definidas em outro arquivo
app.use("/api", eventosRoutes);

// Endpoint básico para verificar se a API está funcionando
// app.get("/", (req, res) => res.send("Api de eventos!"));
app.get("/", checkAuthentication, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Configurar porta e iniciar o servidor
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// predição
const imagePredictionRoutes = require("./routes/imagePredictionRoutes");
app.use("/api", imagePredictionRoutes);
