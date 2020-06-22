const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require("./database/database");
const Pergunta = require("./database/Perguntas")
const Resposta = require("./database/Respostas")

// Conexão com Banco de dados
connection
    .authenticate()
    .then(function () {
        console.log("Conexão com DB realizada com sucesso!");

    })
    .catch(function (error) {
        console.log(error);
    });


// Inserindo o EJS como engine de renderização das views do projeto.
app.set('view engine', 'ejs');
// Setar express a pasta onde nosso arquivos estaticos vão estar.
app.use(express.static('public'));

//Inserir bodyParser no express
app.use(bodyParser.urlencoded({
    extended: false
}));
// O comando abaixo é utilizado para serializar as informações em Json e utilizar em API node.
app.use(bodyParser.json());

// Rotas do Sistema.
/*app.get("/:nome/:lang", (request, response) => {
    // O comando abaixo renderiza o arquivo index.ejs que está na pasta views, 
    // caso possuir sub-diretório o mesmo deve ser informado no comando exemplo: usuario/perfil
    var nome = request.params.nome;
    var lang = request.params.lang;
    var exibirMsg = false;
    // { Abaixo vemos a forma de passar parâmetros para serem renderizados no view por EJS, 
    // solução muito paracida com JSP java ou PHP.}
    var produtos = [{
            nome: "Doritos",
            preco: 2.5
        },
        {
            nome: "Gol bolinha",
            preco: 1500
        },
        {
            nome: "Focus",
            preco: 65000
        }
    ]
    response.render("index", {
        nome: nome,
        lang: lang,
        empresa: "www.devostrowskijr.com.br",
        inscritos: 15974,
        msgErro: exibirMsg,
        produtos: produtos
    });
});
*/

// Rota Realizar pergunta
app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})

// Rota salvar pergunta no banco de dados.
app.post("/salvarPergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    // Realizar insert no banco de dados com sequelize
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(function () {
        res.redirect("/");
    }).catch(function (error) {
        res.send("Erro ao inserir pergunta no BD: " + error);
    })
})

// Rota index
app.get("/", (req, res) => {
    Pergunta.findAll({
        raw: true,
        order: [ ['id', 'desc'] ]
    }).then((perguntas) => {
        res.render("index", {
            perguntas: perguntas
        });
    });
})

// Rota recuperar pergunta no Banco de dados.
app.get("/pergunta/:id", (req, res) => {
    var idPergunta = req.params.id;
    Pergunta.findOne({
        raw: true,
        where: { id: idPergunta }
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                raw: true,
                where : { id_pergunta : pergunta.id},
                order: [["id", "DESC"]]
            }).then((respostas) => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas : respostas
                });
            })
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        res.send("Erro ao solicitar resposta: " + error)
    });
});

// rota Salvar resposta no banco de dados
app.post("/salvarResposta", (req, res) => {
    var idPergunta = req.body.idPergunta;
    var resposta = req.body.resposta;
    Resposta.create({
        corpo: resposta,
        id_pergunta: idPergunta
    }).then(() =>{
        res.redirect("/pergunta/" + idPergunta);
    }).catch(function (error) {
        res.send("Erro ao inserir resposta no BD: " + error);
    });
})

// Start servidor NOde...
app.listen(8080, (error) => {
    if (error) {
        console.log("Erro ao subir servidor Node!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});