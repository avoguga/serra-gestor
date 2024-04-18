"use strict";

var Sequelize = require("sequelize");
var sequelize = new Sequelize("sql10700101", "sql10700101", "a2QQEtNttZ", {
  host: "sql10.freesqldatabase.com",
  dialect: "mysql",
  port: 3306
});
var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.eventos = require("./Evento")(sequelize, Sequelize.DataTypes);
module.exports = db;