const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const path = require("path");

// Configuração do middleware de sessão
app.use(
  session({
    secret: "segredo muito secreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // 1 hora em milissegundos
      httpOnly: true,   // Impede o acesso ao cookie via JavaScript no navegador
      secure: true,
    },
  })
);

app.use((req, res, next) => {
  console.log("Body:", req.body);
  next();
});

// Configurar middlewares básicos
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // Para ler corpos de formulário
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

// Configuração do Passport para usar estratégia Local
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(`Tentativa de login com o usuário: ${username}`);
    db.users
      .findOne({ where: { username: username } })
      .then((user) => {
        if (!user) {
          console.log(`Usuário não encontrado: ${username}`);
          return done(null, false, { message: "Usuário não encontrado." });
        }
        if (!bcrypt.compareSync(password, user.passwordHash)) {
          console.log(`Senha incorreta para o usuário: ${username}`);
          return done(null, false, { message: "Senha incorreta." });
        }
        console.log(`Usuário autenticado: ${username}`);
        return done(null, user);
      })
      .catch((err) => {
        console.error("Erro na autenticação", err);
        done(err);
      });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.users
    .findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
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
app.use(
  "/index.html",
  checkAuthentication,
  express.static("public/index.html")
);

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
