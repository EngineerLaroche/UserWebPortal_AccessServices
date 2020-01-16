///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}

module.exports = function (api, db) {

    //Creation d'un Point de Service
    api.post('/pointservice/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        
        printLog("///////Point Service creation received///////");
        printLog(req.body);
        
        var name = req.body.pointService.name;
        var email = req.body.pointService.email;
        var phone = req.body.pointService.phone;
        var fax = req.body.pointService.fax;
        var nocivique = req.body.pointService.nocivique;
        var street = req.body.pointService.street;
        var city = req.body.pointService.city;
        var province = req.body.pointService.province;
        var postalcode = req.body.pointService.postalcode;

        db.run("INSERT INTO PointService VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", null, name, email, phone, fax, nocivique, street, city, province, postalcode, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "Un Point Service est déjà avec ce email !" });
            }
            else {
                if (error)
                    res.status(404).json({ "Error with Point Service": error.message });
                res.status(200).json({
                    "Message": "Point de Service créé avec succès!"
                })
            }
        });
    });

    //Get tous les Points de Service
    api.get('/pointservices', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("///////GET request for all Points Service///////");
        var sqlQuery = `SELECT Id, Name, Email, Phone, Fax, Nocivique, Street, City, Province, Postalcode FROM PointService WHERE Id > ?`;
        var param = 0;
        db.all(sqlQuery, param, (error, rows) => {
            printLog(rows);
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun Point Service trouvé" });
                else {
                    res.json({
                        rows
                    })
                }
            }
        });
    });

    //Modification d'un Point Service
    api.put('/pointservice/update', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("UPDATE REQUEST FOR POINT SERVICE: " + req.body.pointService.email);

        var params = [req.body.pointService.name, req.body.pointService.email, req.body.pointService.phone, req.body.pointService.fax, req.body.pointService.nocivique, req.body.pointService.street, req.body.pointService.city, req.body.pointService.province, req.body.pointService.postalcode];
        db.all("UPDATE PointService SET Name = ?, Email = ?, Phone = ?, Fax = ?, Nocivique = ?, Street = ?, City = ?, Province = ?, Postalcode = ?", params, function (error,row) {

            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                printLog("UPDATE SUCCESS");
                res.json({
                    Message: "Point Service modifié avec succès!",
                    Email: req.body.pointService.email
                })
            }
            res.end();
        });
    });

    //Get un Point de Service en particulier par son email
    api.get('/pointservice/:email', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")

        var sqlQuery = `SELECT Id, Name, Email, Phone, Fax, Nocivique, Street, City, Province, Postalcode FROM PointService WHERE Email = ?`;
        var param = req.params.email;

        printLog("GET REQUEST FOR POINT SERVICE: " + req.params.email);

        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun Point Service trouvé avec le Email
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun Point Service trouvé" });
                //Sinon en renvoit les informations du Point Service trouvé
                else {
                    var pointServiceFound = rows[0];
                    printLog("Found: " + pointServiceFound.Email);
                    res.json({
                        "pointService": {
                            "id": pointServiceFound.Id,
                            "name": pointServiceFound.Name,
                            "email": pointServiceFound.Email,
                            "phone": pointServiceFound.Phone,
                            "fax": pointServiceFound.Fax,
                            "nocivique": pointServiceFound.Nocivique,
                            "street": pointServiceFound.Street,
                            "city": pointServiceFound.City,
                            "province": pointServiceFound.Province,
                            "postalcode": pointServiceFound.Postalcode
                        }
                    })
                }
            }
        });
    });

    //Delete un Point Service par son id
    api.delete('/pointservice/delete/:id', (req, res) => {
        var sqlQuery = `DELETE FROM PointService WHERE id = ?`;
        var param = req.params.id;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                throw error;
            } else {
                rows.forEach((row) => {
                    printLog(row);
                });
                res.status(200).send({Message: "Point Service cleared"})
            }
        });
    });

    //Vide la table des pointservice, utilisés pour les tests
    api.delete("/pointservice/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM PointService", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "PointService table cleared" });
            }
        })
    })
};