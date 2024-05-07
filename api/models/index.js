const Sequelize = require("sequelize");
const mysql2 = require("mysql2");

const sequelize = new Sequelize("nz_serrabarriga", "avoguga", "50737676", {
  dialect: "mysql",
  dialectModule: mysql2,
  host: "154.127.52.152",
  port: 3306,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.eventos = require("./Evento")(sequelize, Sequelize.DataTypes);

db.users = require("./User")(sequelize, Sequelize.DataTypes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });

module.exports = db;
