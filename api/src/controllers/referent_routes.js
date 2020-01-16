///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}

///Fonction permettant de filtrer un array pour n'avoir que des valeurs distincts
function onlyDistinct(value, index, self) {
    return self.indexOf(value) === index;
}


module.exports = function (api, db) {

    //Creation d'un referent
    api.post('/referent/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("///////Referent creation received///////");
        printLog(req.body);
        var email = req.body.referent.email
        var title = req.body.referent.title;
        var firstname = req.body.referent.firstname;
        var lastname = req.body.referent.lastname;
        var fax = req.body.referent.fax;
        var cellPhone = req.body.referent.cellphone;
        var workPhone = req.body.referent.workphone;

        db.run("INSERT INTO Referent VALUES(?, ?, ?, ?, ?, ?, ?, ?)", null, firstname, lastname, title, workPhone, cellPhone, fax, email, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "Un referent avec ce email est déjà enregistré!" });
            }
            else {
                if (error)
                    res.status(500).json({ error: error.message });
                res.status(200).json({
                    Message: "Référent créé avec succès!"
                })
            }
        });
    });

    //Creation d'un entite d'association entre un referent et un organisme referent
    api.post('/referent/organismereferent', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("referent association to organisme referent received");
        printLog(req.body);
        let referentEmail = req.body.association.email;
        let organismeId = req.body.association.organismeId;
        let param = [referentEmail, organismeId];
        let associateQuery = `SELECT Id FROM Referent WHERE Email = ?`;
        let clearQuery = `DELETE FROM ReferentOrganismeReferent WHERE ReferentId = ?`;
        db.get(associateQuery, referentEmail, (error, row) => {
            if (error) {
                printLog("ERROR" + error);
                res.status(500).json({ error: "Problem retrieving referent by email provided" });
            }
            else {
                printLog("ROW FOR REFERENT ID FOUND: " + row.Id);
                const referentId = row.Id;
                db.run(clearQuery, referentId, function (error, row) {
                    if (error) {
                        printLog("ERROR" + error);
                        res.status(500).json({ error: "Problem adding association between referent and organisme referent" });
                    } else {
                        printLog("ASSOCIATION TO OrganismeReferent WITH ID: " + organismeId);
                        if (organismeId > 0) {
                            db.run("INSERT INTO ReferentOrganismeReferent VALUES(?, ?, ?)", null, referentId, organismeId, function (error, row) {
                                if (error) {
                                    printLog(error);
                                    res.status(500).json({ error: "Problem adding association between referent and organisme referent" });
                                }
                                else {
                                    if (error)
                                        res.status(404).json({ error: error.message });
                                    res.status(200).json({
                                        Message: "Référent associé à organisme référent avec succès!"
                                    })
                                }
                            });
                        }
                    }
                })
            }
        })
    });

    api.delete('/referent/clearpreferences', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog(req.body.association);
        let referentEmail = req.body.association;
        printLog("CLEAR PREFERENCES FOR REFERENT: " + referentEmail);
        let clearQuery = `DELETE FROM PreferenceReferent WHERE ReferentId = ?`;
        let associateQuery = `SELECT Id FROM Referent WHERE Email = ?`;
        db.get(associateQuery, referentEmail, (error, row) => {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "Problem retrieving referent by email provided" });
            }
            else {
                printLog("ROW FOR REFERENT ID FOUND: " + row.Id);
                const referentId = row.Id;
                db.run(clearQuery, referentId, function (error, row) {
                    if (error) {
                        console.log(error)
                        printLog(error);
                        res.status(500).json({ error: "Problem clearing association between referent and preference" });
                    }
                    else {
                        res.status(200).json({
                            Message: "Cleared preferences!"
                        })
                    }
                });
            }
        })

    })

    //Creation d'un entite d'association entre un referent et une preference de reception de rapport
    api.post('/referent/preferencereferent', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("referent preference association received");
        printLog(req.body);
        let referentEmail = req.body.association.email;
        let preferenceId = req.body.association.preferenceId;
        let param = [referentEmail, preferenceId];
        let clearQuery = `DELETE FROM PreferenceReferent WHERE ReferentId = ?`;
        let associateQuery = `SELECT Id FROM Referent WHERE Email = ?`;
        db.get(associateQuery, param[0], (error, row) => {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "Problem retrieving referent by email provided" });
            }
            else {
                printLog("ROW FOR REFERENT ID FOUND: " + row.Id);
                const referentId = row.Id;
                db.run(clearQuery, referentId, function (error, row) {
                    if (error) {
                        printLog(error);
                        res.status(500).json({ error: "Problem adding association between referent and preference" });
                    }
                    else {
                        db.run("INSERT INTO PreferenceReferent VALUES(?, ?, ?)", null, referentId, preferenceId, function (error, row) {
                            if (error) {
                                printLog(error);
                                res.status(500).json({ error: "Problem adding association between referent and preference" });
                            }
                            else {
                                if (error)
                                    res.status(404).json({ error: error.message });
                                res.status(200).json({
                                    Message: "Référent associé à une préférence de réception rapport avec succès!"
                                })
                            }
                        });
                    }
                })
            }
        })
    });

    //Get tous les referent
    api.get('/referents', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("GET REQUEST FOR ALL REFERENTS");
        var sqlQuery = `SELECT Id, Firstname, Lastname, Email, WorkPhone, Title, CellPhone, Fax FROM Referent WHERE Id > ?`;
        var param = 0;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                if (rows.length == 0)
                    res.status(500).send({ error: "No referents found" });
                else {
                    res.json({
                        referents: rows
                    })
                }
            }
        });
    });

    //Get un Referent en particulier par son email
    api.get('/referent/:email', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        var sqlQuery = `SELECT Id, Firstname, Lastname, Title, WorkPhone, CellPhone, Fax, Email FROM Referent WHERE Referent.Email = ?`;
        var param = req.params.email;
        printLog("GET REQUEST FOR REFERENT: " + req.params.email);
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun referent trouvé avec le email
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun référent trouvé" });
                //Sinon en renvoit les informations du referent trouvé
                else {
                    //La query a la db va nous retourner une row pour chaque element trouvé(organisme et preference) avec le meme referent pour chaque row
                    var preferenceIds = [];
                    var organismesIds = [];
                    var organismesNames = [];
                    var preferenceTypes = [];
                    for (var i = 0; i < rows.length; i++) {
                        preferenceIds.push(rows[i].PreferenceId);
                        organismesIds.push(rows[i].OrganismeReferentId);
                        organismesNames.push(rows[i].OrganismeName);
                        preferenceTypes.push(rows[i].PreferenceType);
                    }
                    var referentFound = rows[0];
                    printLog("Found: " + referentFound.Firstname + " " + referentFound.Lastname);
                    res.json({
                        "referent": {
                            "id": referentFound.Id,
                            "email": referentFound.Email,
                            "firstname": referentFound.Firstname,
                            "lastname": referentFound.Lastname,
                            "title": referentFound.Title,
                            "workphone": referentFound.WorkPhone,
                            "cellphone": referentFound.CellPhone,
                            "fax": referentFound.Fax,
                            "preferences": preferenceIds.filter(onlyDistinct),
                            "organismeReferentIds": organismesIds.filter(onlyDistinct),
                            "organismeReferentNames": organismesNames.filter(onlyDistinct),
                            "preferenceTypes": preferenceTypes.filter(onlyDistinct)
                        }
                    })
                }
            }
        });
    });

    //Get tous les referent avec le titre d'avocat
    api.get('/avocats', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        var sqlQuery = `SELECT Id, Firstname, Lastname, Title, WorkPhone, CellPhone, Fax, Email FROM Referent WHERE Title = ?`;
        var param = "Avocat";
        printLog("GET REQUEST FOR REFERENT AVOCATS");
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun avocat trouvé
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun avocat trouvé" });
                //Sinon en renvoit les informations des avocats trouvé
                else {
                    res.status(200).json({
                        Avocats: rows
                    })
                }
            }
        });
    });

    api.get('/referent/associations/:email', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog(req.body.user);
        var param = req.params.email;
        var preferenceTypes = [];
        var organismeReferents = [];
        var preferencesQuery = `SELECT Preference.Type AS PreferenceType, Preference.Id AS PreferenceId FROM Referent 
                                INNER JOIN PreferenceReferent ON Referent.Id = PreferenceReferent.ReferentId
                                INNER JOIN Preference ON Preference.Id = PreferenceReferent.PreferenceId
                                WHERE Referent.Email = ?`;
        var organismesQuery = `SELECT OrganismeReferent.Name AS OrganismeName, OrganismeReferent.Id AS OrganismeId FROM Referent 
                                INNER JOIN ReferentOrganismeReferent ON Referent.Id = ReferentOrganismeReferent.ReferentId
                                INNER JOIN OrganismeReferent ON OrganismeReferent.Id = ReferentOrganismeReferent.OrganismeReferentId
                                WHERE Referent.Email =  ?`;
        db.get(preferencesQuery, param, function (error, rows) {
            if (error) {
                printLog(error);
                //res.status(500).send({ error: error.message });
                res.json({
                    "preferenceTypes": preferenceTypes,
                    "organismeReferentNames": organismeReferents
                });
            }
            else {
                printLog("GET ASSOCIATIONS FOR REFERENTS");
                if (rows.length > 1)
                    preferenceTypes = rows;
                else if (rows.length == 0)
                    preferenceTypes = [];
                else
                    preferenceTypes = [rows];
                db.all(organismesQuery, param, function (error, rows) {
                    if (error) {
                        printLog(error);
                        res.json({
                            "preferenceTypes": preferenceTypes,
                            "organismeReferents": organismeReferents
                        });
                        //res.status(500).send({ error: error.message });
                    }
                    else {
                        if (rows.length >= 1)
                            organismeReferents = rows;
                        else
                            organismeReferents = [];
                        printLog(rows[0]);
                        res.json({
                            "preferenceTypes": preferenceTypes,
                            "organismeReferents": organismeReferents
                        });
                    }
                    res.end();
                });
            }
        })
    });

    //Modification d'un referent
    api.put('/referent/update', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("UPDATE REQUEST FOR REFERENT: " + req.body.user);
        var params = [req.body.referent.firstname, req.body.referent.lastname, req.body.referent.title, req.body.referent.cellPhone, req.body.referent.workPhone, req.body.referent.fax, req.body.referent.email, req.body.referent.id];
        db.all("UPDATE Referent SET Firstname = ?, Lastname = ?, Title = ?, CellPhone = ?, WorkPhone = ?, Fax = ?, Email = ? WHERE Id = ?", params, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.json({
                    Message: "Referent mis à jour avec succès!",
                    Email: req.body.referent.email
                })
            }
            res.end();
        });
    });

    //Get un ou plusieurs Referent par un string de recherche
    api.get('/referent/search/:query', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        let returnedReferents = [];
        let organismeIds = [];
        var organismeQuery = `SELECT Id FROM OrganismeReferent WHERE Name LIKE ?`;
        var organismeQueryParam = [req.params.query];

        //Comme la recherche peut s'effectuer avec le nom de l'organisme referent, on recherche les organismes referents en premier
        db.all(organismeQuery, organismeQueryParam, (error, rows) => {
            if (error) {
                printLog("Error searching referents: " + error);
                res.status(500).send({ error: "Error" });
            }
            else {
                for (var i = 0; i < rows.length; rows++) {
                    organismeIds.push(rows[i].Id);
                }
                //Si la requete a trouvé des organismes avec la query, on doit trouver les referents associé a cette organisme referent
                if (organismeIds.length > 0) {
                    for (var k = 0; k < organismeIds.length; k++) {
                        var id = organismeIds[k];
                        var referentOrganismeQuery = `SELECT DISTINCT Referent.Id, Firstname, Lastname, Email, Title, WorkPhone, CellPhone, Fax FROM Referent INNER JOIN ReferentOrganismeReferent ON Referent.Id = ReferentOrganismeReferent.ReferentId WHERE ReferentOrganismeReferent.OrganismeReferentId = ?`;
                        var paramId = [id];
                        db.all(referentOrganismeQuery, paramId, (error, rows) => {
                            if (error) {
                                printLog(error);
                            } else {
                                for (var k = 0; k < rows.length; k++) {
                                    returnedReferents.push(rows[k]);
                                }
                            }
                        });
                    }
                }
                var sqlQuery = `SELECT DISTINCT Id, Firstname, Lastname, Email, Title, WorkPhone, CellPhone, Fax FROM Referent WHERE Firstname LIKE ? OR Lastname LIKE ? OR Workphone LIKE ? OR Cellphone LIKE ?`;
                var param = [req.params.query, req.params.query, req.params.query, req.params.query];
                printLog("SEARCH REQUEST FOR REFERENT WITH QUERY: " + req.params.query);
                db.all(sqlQuery, param, (error, rows) => {
                    if (error) {
                        printLog("Error searching referents: " + error);
                        res.status(500).send({ error: "Error" });
                    }
                    else {
                        //Si aucun referent trouvé avec le Email
                        if (rows.length == 0) {
                            printLog("NO REFERENTS FOUND FOR QUERY: " + param[0]);
                            res.status(200).json({ returnedReferent: returnedReferents });
                        }
                        //Sinon en ajoute les informations des referents trouvés
                        else {
                            printLog("FOUND REFERENT FROM SEARCH: ");
                            printLog(rows);
                            for (var k = 0; k < rows.length; k++) {
                                returnedReferents.push(rows[k]);
                            }
                            res.status(200).json({
                                returnedReferents
                            })
                        }
                    }
                });
            }
        });
    });

    //Delete un Referent par son id
    api.delete('/referent/delete/:id', (req, res) => {
        var sqlQuery = `DELETE FROM Referent WHERE id = ?`;
        var param = req.params.id;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({Message: "Delete fail"});
                throw error;
            }
            else {
                res.status(200).send({Message: "Delete success"});
            }
        });
    });

    //Vide la table des referents, utilisés pour les tests
    api.delete("/referent/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM Referent", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "Referent table cleared" });
            }
        });
    });

    //Vide la table des association entre referents et organisme referents, utilisés pour les tests
    api.delete("/referentassociation/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM ReferentOrganismeReferent", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "ReferentOrganismeReferent table cleared" });
            }
        })
    })

    //Vide la table des association entre referents et preference, utilisés pour les tests
    api.delete("/referentpreference/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM PreferenceReferent", (error) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "PreferenceReferent table cleared" });
            }
        })
    })

    api.get("/preferencesreferent", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("SELECT * FROM Preference", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).json({ Preferences: rows });
            }
        })
    })
};