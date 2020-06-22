const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define("tb_perguntas", {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false});

module.exports = Pergunta;