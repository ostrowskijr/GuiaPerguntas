const Sequelize = require("sequelize");
const connection = new Sequelize("guiaperguntas", "root", "194469", {
    host: "localhost",
    dialect: "mysql"
});

// Realizando exporte da coneção para utilização em outros arquivos .js do sistema
module.exports = connection;