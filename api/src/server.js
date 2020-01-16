const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
var db;

//Creation de la db
var environment = process.env.NODE_ENV
console.log(environment);
if (environment.localeCompare("dev ") == 0) {
    db = new sqlite3.Database("dbLog210.sqlite");
} else{
    db = new sqlite3.Database("dbUnitTests.sqlite");
}

const bodyParser = require("body-parser");
const { graphiqlExpress } = require("apollo-server");

const { server } = require("./config/config");

const app = express();

//Utilisation du bodyparser pour parser les parametres des requêtes reçues
app.use(bodyParser.urlencoded({ extended: true }));

//Utilisation du bodyparser pour parser les parametres des requetes en json
app.use(bodyParser.json());

require('./config/db')(db, {});

//Routes des requetes api pour les User
require("./controllers/user_routes")(app, db, {});
//Routes des requetes api pour les Referent
require("./controllers/referent_routes")(app, db, {});
//Routes des requetes api pour les Organisme
require("./controllers/organisme_routes")(app, db, {});
//Routes des requetes api pour les Organisme référent
require("./controllers/organismereferent_routes")(app, db, {});
//Routes des requetes api pour les demandes de service et ce qui y concerne
require("./controllers/demandeservice_routes")(app, db, {});
//Routes des requetes api pour les demandes de service et ce qui y concerne
require("./controllers/parent_routes")(app, db, {});
//Routes des requetes api pour les Points de Service
require("./controllers/pointservice_routes")(app, db, {});
//Routes des requetes api pour les Services
require("./controllers/service_routes")(app, db, {});

//Routes des requetes api pour les demandes de service et ce qui y concerne
//require("./controllers/enfant_routes")(app, db, {});

var corsOptions = { origin: "http://localhost:3000" };

app.use(cors(corsOptions));

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(server.port, () =>
    console.log(`Now browse to ${server.host}:${server.port}/graphiql`)
);

module.exports = app;