module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Evento", {
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Mes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DescriptionPT: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    DescriptionEN: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Span: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
