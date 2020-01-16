///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}

module.exports = function (api, db) {
    
    //Creation d'un organisme
    api.post('/organisme/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")

        printLog("///////Organism creation received///////");
        printLog(req.body.organisme);

        var email = req.body.organisme.email;
        var name = req.body.organisme.name;
        var phone = req.body.organisme.phone;
        var fax = req.body.organisme.fax;
        var address = {
            nocivique: req.body.organisme.address.nocivique,
            street: req.body.organisme.address.street,
            city: req.body.organisme.address.city,
            province: req.body.organisme.address.province,
            postalcode: req.body.organisme.address.postalcode
        }
        db.run("INSERT INTO Address VALUES(?, ?, ?, ?, ?, ?)", null, address.nocivique, address.street, address.city, address.province, address.postalcode, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "Error adding address to database" });
            }
            else {
                if (error)
                    res.status(404).json({ "Error with address": error.message });
                else {
                    db.run("INSERT INTO Organisme VALUES(?, ?, ?, LAST_INSERT_ROWID(), ?, ?)", null, name, email, phone, fax, function (error, row) {
                        if (error) {
                            printLog(error);
                            res.status(500).json({ error: "An organism with this email is already registered" });
                        }
                        else {
                            if (error)
                                res.status(404).json({ "Error with organism": error.message });
                            res.status(200).json({
                                "Message": "Organisme créé avec succès!"
                            })
                        }
                    });
                }
            }
        });
    });

    api.put('/organisme/update', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")

        printLog("///////Organism update received///////");
        printLog(req.body.organisme);
        var organismeId = req.body.organisme.id;
        var email = req.body.organisme.email;
        var name = req.body.organisme.name;
        var phone = req.body.organisme.phone;
        var fax = req.body.organisme.fax;
        var address = {
            id: req.body.organisme.addressId,
            nocivique: req.body.organisme.nocivique,
            street: req.body.organisme.street,
            city: req.body.organisme.city,
            province: req.body.organisme.province,
            postalcode: req.body.organisme.postalcode
        }
        db.run("UPDATE Address SET NoCivique = ?, Street = ?, City = ?, Province = ?, PostalCode = ? WHERE Id = ?", address.nocivique, address.street, address.city, address.province, address.postalcode, address.id, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "Error updating address to database" });
            }
            else {
                if (error)
                    res.status(404).json({ "Error with address": error.message });
                else {
                    db.run("UPDATE Organisme SET Name = ?, Email = ?, Phone = ?, Fax= ? WHERE Id = ?", name, email, phone, fax, organismeId, function (error, row) {
                        if (error) {
                            printLog(error);
                            res.status(500).json({ error: "An organism with this email is already registered" });
                        }
                        else {
                            if (error)
                                res.status(404).json({ "Error with organism": error.message });
                            res.status(200).json({
                                "Message": "Organisme modifié avec succès!"
                            })
                        }
                    });
                }
            }
        });
    });

    //Get tous les organismes
    api.get('/organismes', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("GET REQUEST FOR ALL ORGANISMS");
        var sqlQuery = `SELECT Id, Name, Address, Email, Phone, Fax FROM Organisme WHERE Id > ?`;
        var param = 0;
        db.all(sqlQuery, param, (error, rows) => {
            printLog(rows);
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun organisme trouvé" });
                else {
                    res.json({
                        rows
                    })
                }
            }

        });
    });

    //Get un Organisme en particulier par son email
    api.get('/organisme/:email', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        var sqlQuery = `SELECT Id, Name, Address, Email, Phone, Fax FROM Organisme WHERE Email = ?`;
        var param = req.params.email;
       
        printLog("GET REQUEST FOR: " + req.params.email);
       
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun organisme trouvé avec le Email
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun organisme trouvé" });
                //Sinon on renvoit les informations de l'organisme trouvé
                else {
                    var organismFound = rows[0];
                    printLog("Found: " + organismFound.Email);
                    res.json({
                        "organisme": {
                            "id": organismFound.Id,
                            "email": organismFound.Email,
                            "name": organismFound.Name,
                            "fax": organismFound.Fax,
                            "phone": organismFound.Phone,
                            "address": organismFound.Address
                        }
                    })
                }
            }
        });
    });

    //Delete un Organisme par son id
    api.delete('/organisme/delete/:id', (req, res) => {
        var sqlQuery = `DELETE FROM Organisme WHERE id = ?`;
        var param = req.params.id;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                throw error;
            }
            else {
                rows.forEach((row) => {
                    printLog(row);
                });
                res.status(200).send({Message: "Organisme deleted"});
            }
        });
    });

    //Vide la table des organismes, utilisés pour les tests
    api.delete("/organisme/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM Organisme", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "User table cleared" });
            }
        })
    })
};