///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
  var environment = process.env.NODE_ENV;
  if (environment != null && environment.localeCompare("dev ") == 0) {
    console.log(log);
  }
}

module.exports = function(api, db) {
  //Creation d'un organisme
  api.post("/organisme/create", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    printLog("///////Organism creation received///////");
    printLog(req.body.organisme);

    var email = req.body.organisme.email;
    var name = req.body.organisme.name;
    var phone = req.body.organisme.phone;
    var fax = req.body.organisme.fax;
    var nocivique = req.body.organisme.nocivique;
    var street = req.body.organisme.street;
    var city = req.body.organisme.city;
    var province = req.body.organisme.province;
    var postalcode = req.body.organisme.postalcode;
    var actif = req.body.organisme.actif;
//LAST_INSERT_ROWID()
    db.run(
      "INSERT INTO Organisme VALUES(?, ?, ?, LAST_INSERT_ROWID(), ?, ?, ?, ?, ?, ?, ?)",
      null,
      name,
      email,
      phone,
      fax,
      nocivique,
      street,
      city,
      province,
      postalcode,
      actif,
      function(error, row) {
        if (error) {
          printLog(error);
          res
            .status(500)
            .json({ error: "Un Organisme possède déjà ce email !" });
        } else {
          if (error)
            res.status(404).json({ "Error with Organisme": error.message });
          res.status(200).json({
            Message: "Organisme créé avec succès!",
          });
        }
      }
    );
  });

  //Modification d'un Organisme
  api.put("/organisme/update", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    printLog("UPDATE REQUEST FOR ORGANISME: " + req.body.organisme.email);
    var params = [
      req.body.organisme.name,
      req.body.organisme.email,
      req.body.organisme.phone,
      req.body.organisme.fax,
      req.body.organisme.nocivique,
      req.body.organisme.street,
      req.body.organisme.city,
      req.body.organisme.province,
      req.body.organisme.postalcode,
      req.body.organisme.actif
    ];

    db.all(
      "UPDATE Organisme SET Name = ?, Email = ?, Phone = ?, Fax = ?, NoCivique = ?, Street = ?, City = ?, Province = ?, PostalCode = ?, Actif = ?",
      params,
      function(error, row) {
        if (error) {
          printLog(error);
          res.status(500).send({ error: error.message });
        } else {
          printLog("UPDATE SUCCESS");
          res.json({
            Message: "Organisme modifié avec succès!",
            Email: req.body.organisme.email,
          });
        }
        res.end();
      }
    );
  });

  //Get tous les organismes
  api.get("/organismes", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    printLog("GET REQUEST FOR ALL ORGANISMS");
    var sqlQuery = `SELECT Id, Name, Email, Phone, Fax, NoCivique, Street, City, Province, PostalCode, Actif FROM Organisme WHERE Id > ?`;
    var param = 0;
    db.all(sqlQuery, param, (error, rows) => {
      printLog(rows);
      if (error) {
        res.status(500).send({ error: "Error" });
        throw error;
      } else {
        if (rows.length == 0)
          res.status(500).send({ error: "Aucun organisme trouvé" });
        else {
          res.json({
            rows
          });
        }
      }
    });
  });

  //Get un Organisme en particulier par son email
  api.get("/organisme/:email", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    var sqlQuery = `SELECT Id, Name, Email, Phone, Fax, NoCivique, Street, City, Province, PostalCode, Actif FROM Organisme WHERE Email = ?`;
    var param = req.params.email;

    printLog("GET REQUEST FOR: " + req.params.email);

    db.all(sqlQuery, param, (error, rows) => {
      if (error) {
        res.status(500).send({ error: "Error" });
        throw error;
      } else {
        //Si aucun organisme trouvé avec le Email
        if (rows.length == 0)
          res.status(500).send({ error: "Aucun organisme trouvé" });
        //Sinon on renvoit les informations de l'organisme trouvé
        else {
          var organismFound = rows[0];
          printLog("Found: " + organismFound.Email);
          res.json({
            organisme: {
              id: organismFound.Id,
              name: organismFound.Name,
              email: organismFound.Email,
              phone: organismFound.Phone,
              fax: organismFound.Fax,
              nocivique: organismFound.NoCivique,
              street: organismFound.Street,
              city: organismFound.City,
              province: organismFound.Province,
              postalcode: organismFound.PostalCode,
              actif: organismFound.Actif
            },
          });
        }
      }
    });
  });

  //Delete un Organisme par son id
  api.delete("/organisme/delete/:id", (req, res) => {
    var sqlQuery = `DELETE FROM Organisme WHERE id = ?`;
    var param = req.params.id;
    db.all(sqlQuery, param, (error, rows) => {
      if (error) {
        throw error;
      } else {
        rows.forEach((row) => {
          printLog(row);
        });
        res.status(200).send({ Message: "Organisme deleted" });
      }
    });
  });

  //Vide la table des organismes, utilisés pour les tests
  api.delete("/organisme/wipe", function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    db.all("DELETE FROM Organisme", (error, rows) => {
      if (error) {
        res.status(500).send({ error: "Error" });
      } else {
        res.status(200).send({ Message: "Organisme table cleared" });
      }
    });
  });
};
