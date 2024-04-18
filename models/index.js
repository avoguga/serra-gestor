const Sequelize = require("sequelize");

const sequelize = new Sequelize("sql10700101", "sql10700101", "a2QQEtNttZ", {
  host: "sql10.freesqldatabase.com",
  dialect: "mysql",
  port: 3306,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.eventos = require("./Evento")(sequelize, Sequelize.DataTypes);

module.exports = db;
