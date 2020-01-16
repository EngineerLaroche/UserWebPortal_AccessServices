const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

// Internationalization
var i18n = require("./i18n");

const bodyParser = require("body-parser");
const { graphiqlExpress } = require("apollo-server");

const { server } = require("./config");

const app = express();

//Creation de la db
const db = new sqlite3.Database("dbtest");

//Creation de la table User
db.serialize(function() {
  db.run(
    "CREATE TABLE IF NOT EXISTS `User` (`Id` INTEGER PRIMARY KEY, `Firstname` TEXT, `Lastname` TEXT, `Email` TEXT UNIQUE, `Password` TEXT, 'Role' INTEGER, 'LoginAttempts' INTEGER, 'Active' INTEGER, FOREIGN KEY(Role) REFERENCES Role(Id))"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS `BadLoginAttempts` (`Id` INTEGER PRIMARY KEY, `Email` TEXT, 'Date' TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS `Role` (`Id` INTEGER PRIMARY KEY, `Title` TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS `Organisme` (`Id` INTEGER PRIMARY KEY, `Name` TEXT, 'Email' TEXT, 'Address' INTEGER, 'Phone' TEXT, 'Fax' TEXT, 'WebSite' TEXT, 'State' TEXT, FOREIGN KEY(Address) REFERENCES Address(Id))"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS `Address` (`Id` INTEGER PRIMARY KEY, `NoCivique` TEXT, 'Street' TEXT, 'City' TEXT, 'Province' TEXT, 'PostalCode' TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS `Referent` (`Id` INTEGER PRIMARY KEY, `Firstname` TEXT, 'Lastname' TEXT, 'Title' TEXT, 'WorkPhone' TEXT, 'CellPhone' TEXT, 'Fax' TEXT, 'Email' TEXT, 'PREFERENCE' INTEGER)"
  );
  db.run(
    "INSERT INTO ROLE SELECT 1, 'Directeur' EXCEPT SELECT * FROM Role WHERE Id=1"
  );
  db.run(
    "INSERT INTO ROLE SELECT 2, 'Coordonateur' EXCEPT SELECT * FROM Role WHERE Id=2"
  );
  db.run(
    "INSERT INTO ROLE SELECT 3, 'Adjoint-Coordonateur' EXCEPT SELECT * FROM Role WHERE Id=3"
  );
  db.run(
    "INSERT INTO ROLE SELECT 4, 'Intervenant' EXCEPT SELECT * FROM Role WHERE Id=4"
  );
  db.run(
    "INSERT INTO USER SELECT 1, 'Yvan' , 'Ross' , 'yross@gucci.com' , '12345' , '1', '0', '0' WHERE NOT EXISTS (SELECT * FROM User) "
  );
  db.run(
    "UPDATE User SET LoginAttempts = 0"
  );
});

// Middleware de pour la traduction
//app.use(i18n);

//Utilisation du bodyparser pour parser les parametres des requêtes reçues
app.use(bodyParser.urlencoded({ extended: true }));

//Utilisation du bodyparser pour parser les parametres des requetes en json
app.use(bodyParser.json());

//Routes des requetes api pour les User
require("./routes/api/user_routes")(app, db, {});

var corsOptions = { origin: "http://localhost:3000" };

app.use(cors(corsOptions));

app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.listen(server.port, () =>
  console.log(`Now browse to ${server.host}:${server.port}/graphiql`)
);

module.exports = app;
