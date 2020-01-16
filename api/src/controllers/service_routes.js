///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}

module.exports = function (api, db) {

    //Creation d'un Service
    api.post('/service/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")

        printLog("///////Service creation received///////");
        printLog(req.body);

        var name = req.body.service.name;
        var description = req.body.service.description;
        var tarifParent = req.body.service.tarifParent;
        var tarifCISSS = req.body.service.tarifCISSS;
        var stateSubvention = req.body.service.stateSubvention;
        var state = req.body.service.state;
        var datePrice = req.body.service.datePrice;

        db.run("INSERT INTO Service VALUES(?, ?, ?, ?, ?, ?, ?, ?)", null, name, description, tarifParent, tarifCISSS, stateSubvention, state, datePrice, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "Un Service est déjà enregistré sous ce nom!" });
            }
            else {
                if (error)
                    res.status(404).json({ "Error with Service": error.message });
                res.status(200).json({
                    "Message": "Service créé avec succès!"
                })
            }
        });
    });

    //Creation d'un entite d'association entre un service et un point de service
    // api.post('/service/pointservice', function (req, res) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
    //     res.header("Access-Control-Allow-Headers", "Content-Type")
    //     printLog("Service association to Point Service received");
    //     printLog(req.body);
    //     let serviceName = req.body.association.name;
    //     let pointServiceId = req.body.association.pointServiceId;
    //     let param = [serviceName, pointServiceId];
    //     let associateQuery = `SELECT Id FROM Service WHERE Name = ?`;
    //     let clearQuery = `DELETE FROM ServicePointService WHERE ServiceId = ?`;
    //     db.get(associateQuery, serviceName, (error, row) => {
    //         if (error) {
    //             printLog("ERROR" + error);
    //             res.status(500).json({ error: "Problem retrieving Service by Name provided" });
    //         }
    //         else {
    //             printLog("ROW FOR SERVICE ID FOUND: " + row.Id);
    //             const serviceId = row.Id;
    //             db.run(clearQuery, referentId, function (error, row) {
    //                 if (error) {
    //                     printLog("ERROR" + error);
    //                     res.status(500).json({ error: "Problem adding association between Service and Point Service" });
    //                 } else {
    //                     printLog("ASSOCIATION TO PointService WITH ID: " + pointServiceId);
    //                     if (organismeId > 0) {
    //                         db.run("INSERT INTO ServicePointService VALUES(?, ?, ?)", null, serviceId, pointServiceId, function (error, row) {
    //                             if (error) {
    //                                 printLog(error);
    //                                 res.status(500).json({ error: "Problem adding association between Servicet and Point Service" });
    //                             }
    //                             else {
    //                                 if (error)
    //                                     res.status(404).json({ error: error.message });
    //                                 res.status(200).json({
    //                                     Message: "Service associé à Point Service avec succès!"
    //                                 })
    //                             }
    //                         });
    //                     }
    //                 }
    //             })
    //         }
    //     })
    // });

    // api.get('/service/associations/:name', function (req, res) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
    //     res.header("Access-Control-Allow-Headers", "Content-Type")
    //     printLog(req.body.user);
    //     var param = req.params.email;
    //     var pointsService = [];
    //     var pointsServiceQuery = ` INNER JOIN ServicePointService ON Service.Id = ServicePointService.ServiceId
    //                                 INNER JOIN PointService ON PointService.Id = ServicePointService.PointServiceId
    //                                 WHERE Service.Name =  ?`;
    //     db.get(preferencesQuery, param, function (error, rows) {
    //         if (error) {
    //             printLog(error);
    //             //res.status(500).send({ error: error.message });
    //             res.json({
    //                 "preferenceTypes": preferenceTypes,
    //                 "organismeReferentNames": organismeReferents
    //             });
    //         }
    //         else {
    //             printLog("GET ASSOCIATIONS FOR REFERENTS");
    //             if (rows.length > 1)
    //                 preferenceTypes = rows;
    //             else if (rows.length == 0)
    //                 preferenceTypes = [];
    //             else
    //                 preferenceTypes = [rows];
    //             db.all(organismesQuery, param, function (error, rows) {
    //                 if (error) {
    //                     printLog(error);
    //                     res.json({
    //                         "preferenceTypes": preferenceTypes,
    //                         "organismeReferents": organismeReferents
    //                     });
    //                     //res.status(500).send({ error: error.message });
    //                 }
    //                 else {
    //                     if (rows.length >= 1)
    //                         organismeReferents = rows;
    //                     else
    //                         organismeReferents = [];
    //                     printLog(rows[0]);
    //                     res.json({
    //                         "preferenceTypes": preferenceTypes,
    //                         "organismeReferents": organismeReferents
    //                     });
    //                 }
    //                 res.end();
    //             });
    //         }
    //     })
    // });

    //Get tous les Services
    api.get('/services', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("///////GET request for all services///////");
        var sqlQuery = `SELECT Id, Name, Description, TarifParent, TarifCISSS, StateSubvention, State, DatePrice FROM Service WHERE Id > ?`;
        var param = 0;
        db.all(sqlQuery, param, (error, rows) => {
            printLog(rows);
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun Service trouvé" });
                else {
                    res.json({
                        rows
                    })
                }
            }
        });
    });

    //Get un Service en particulier par son nom
    api.get('/service/:name', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")

        var sqlQuery = `SELECT Id, Name, Description, TarifParent, TarifCISSS, StateSubvention, State, DatePrice FROM Service WHERE Name = ?`;
        var param = req.params.name;

        printLog("GET REQUEST FOR SERVICE: " + req.params.name);

        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun Service trouvé avec le Nom
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun Service trouvé" });
                //Sinon en renvoit les informations du Service trouvé
                else {
                    var serviceFound = rows[0];
                    printLog("Found: " + serviceFound.Name);
                    res.json({
                        "service": {
                            "id": serviceFound.Id,
                            "name": serviceFound.Name,
                            "description": serviceFound.Description,
                            "tarifParent": serviceFound.TarifParent,
                            "tarifCISSS": serviceFound.TarifCISSS,
                            "stateSubvention": serviceFound.StateSubvention,
                            "state": serviceFound.State,
                            "datePrice": serviceFound.DatePrice
                            //"pointService": serviceFound.PointService,
                        }
                    })
                }
            }
        });
    });

    //Modification d'un Service
    api.put('/service/update', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("UPDATE REQUEST FOR SERVICE: " + req.body.service.name);

        var params = [req.body.service.name, req.body.service.description, req.body.service.tarifParent, req.body.service.tarifCISSS, req.body.service.stateSubvention, req.body.service.state, req.body.service.datePrice];
        db.all("UPDATE Service SET Name = ?, Description = ?, TarifParent = ?, TarifCISSS = ?, StateSubvention = ?, State = ?, DatePrice = ?", params, function (error, row) {

            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                printLog("UPDATE SUCCESS");
                res.json({
                    Message: "Service modifié avec succès!",
                    Name: req.body.service.name
                })
            }
            res.end();
        });
    });

    //Delete un Service par son id
    api.delete('/service/delete/:id', (req, res) => {
        var sqlQuery = `DELETE FROM Service WHERE id = ?`;
        var param = req.params.id;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                throw error;
            } else {
                rows.forEach((row) => {
                    printLog(row);
                });
                res.status(200).send({ Message: "Suppression de service reussit" })
            }
        });
    });

    //Vide la table des association entre service et point service, utilisés pour les tests
    // api.delete("/serviceassociation/wipe", function (req, res) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
    //     res.header("Access-Control-Allow-Headers", "Content-Type")
    //     db.all("DELETE FROM ServicePointService", (error, rows) => {
    //         if (error) {
    //             res.status(500).send({ error: "Error" });
    //         } else {
    //             res.status(200).send({ Message: "ServicePointService table cleared" });
    //         }
    //     })
    // })

    //Vide la table des Services, utilisés pour les tests
    api.delete("/service/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM Service", (error) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "Service table cleared" });
            }
        })
    })
};
