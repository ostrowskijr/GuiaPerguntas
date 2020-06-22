const Sequelize = require("sequelize");
const connection = require("./database");

const Resposta = connection.define("tb_respostas", {
    corpo : {
        type: Sequelize.TEXT,
        allowNull: false
    },
    id_pergunta: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Resposta.sync({force : false});

module.exports = Resposta;