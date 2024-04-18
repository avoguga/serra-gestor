const Sequelize = require("sequelize");
const mysql2 = require("mysql2");

const sequelize = new Sequelize("sql10700101", "sql10700101", "a2QQEtNttZ", {
  dialect: "mysql",
  dialectModule: mysql2,
  host: "sql10.freesqldatabase.com",
  port: 3306,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.eventos = require("./Evento")(sequelize, Sequelize.DataTypes);

module.exports = db;
