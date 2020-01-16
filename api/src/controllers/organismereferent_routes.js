///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}


module.exports = function (api, db) {
    //Creation d'un organisme referent
    api.post('/organismereferent/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("///////Organism Referent creation received///////");
        printLog(req.body.organismeReferent);
        var email = req.body.organismeReferent.email
        var name = req.body.organismeReferent.name;
        var phone = req.body.organismeReferent.phone;
        var fax = req.body.organismeReferent.fax;
        var website = req.body.organismeReferent.website;
        var state = req.body.organismeReferent.state;
        var organisme = req.body.organismeReferent.organisme;
        var address = {
            nocivique: req.body.organismeReferent.address.nocivique,
            street: req.body.organismeReferent.address.street,
            city: req.body.organismeReferent.address.city,
            province: req.body.organismeReferent.address.province,
            postalcode: req.body.organismeReferent.address.postalcode
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
                    db.run("INSERT INTO OrganismeReferent VALUES(?, ?, ?, LAST_INSERT_ROWID(), ?, ?, ?, ?, ?)", null, name, email, phone, fax, website, state, organisme, function (error, row) {
                        if (error) {
                            printLog(error);
                            res.status(500).json({ error: "An organism referent with this email is already registered" });
                        }
                        else {
                            if (error)
                                res.status(404).json({ "Error with organism referent": error.message });
                            res.status(200).json({
                                Message: "Organisme référent créé avec succès!"
                            })
                        }
                    });
                }
            }
        });
    });

    //Get tous les organismes referent
    api.get('/organismereferents', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("GET REQUEST FOR ALL ORGANISMES REFERENTS");
        var sqlQuery = `SELECT Id, Name, Address, Email, Phone, Website, State, Fax FROM OrganismeReferent WHERE Id > ?`;
        var param = 0;
        db.all(sqlQuery, param, (error, rows) => {
            printLog(rows);
            if (error) {
                res.status(500).send({ error: error });
                throw error;
            }
            else {
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun organisme referent trouvé" });
                else {
                    res.json({
                        rows
                    })
                }
            }
        });
    });

    //Modification d'un organisme referent
    api.put('/organismereferent/update', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("UPDATE REQUEST FOR ORGANISME REFERENT: " + req.body.organismeReferent.email);
        var params = [req.body.organismeReferent.name, req.body.organismeReferent.phone, req.body.organismeReferent.email, req.body.organismeReferent.website, req.body.organismeReferent.state, req.body.organismeReferent.fax, req.body.organismeReferent.id];
        var addressParams = [req.body.organismeReferent.nocivique, req.body.organismeReferent.street, req.body.organismeReferent.city, req.body.organismeReferent.province, req.body.organismeReferent.postalcode, req.body.organismeReferent.addressid];
        var addressQuery = "UPDATE Address SET NoCivique = ?, Street = ?, City = ?, Province = ?, PostalCode = ? WHERE Id = ?";
        db.all(addressQuery, addressParams, function (error, row){
            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                db.all("UPDATE OrganismeReferent SET Name = ?, Phone = ?, Email = ?, WebSite = ?, State = ?, Fax = ? WHERE Id = ?", params, function (error, row) {
                    if (error) {
                        printLog(error);
                        res.status(500).send({ error: error.message });
                    }
                    else {
                        printLog("UPDATE SUCCESS");
                        res.json({
                                Message : "Organisme Référent modifié avec succès!",
                                Email : req.body.organismeReferent.email
                        });
                    }
                    res.end();
                });
            }
        })
    });

    //Get un Organisme referent en particulier par son email
    api.get('/organismereferent/:email', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        var sqlQuery = `SELECT Id, Name, Address, Email, Phone, Fax, Website, State FROM OrganismeReferent WHERE Email = ?`;
        var addressQuery = `SELECT Id, NoCivique, Street, City, Province, PostalCode FROM Address WHERE Id = ?`;
        var param = req.params.email;
        
        printLog("GET REQUEST FOR ORGANISM REFERENT: " + req.params.email);
        
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: error });
                throw error;
            }
            else {
                //Si aucun organisme trouvé avec le Email
                if (rows.length == 0)
                    res.status(500).send({ error: "Aucun Organisme trouvé" });
                //Sinon en renvoit les informations de l'organisme trouvé
                else {
                    var organismFound = rows[0];
                    printLog("Found: " + organismFound.Email);
                    var addressParam = organismFound.Address
                    db.all(addressQuery, addressParam, (error, rows) => {
                        if(error){
                            printLog("ERROR GETTING ADDRESS:" + error)
                            res.json({
                                "organismeReferent": {
                                    "id": organismFound.Id,
                                    "email": organismFound.Email,
                                    "name": organismFound.Name,
                                    "fax": organismFound.Fax,
                                    "website": organismFound.WebSite,
                                    "phone": organismFound.Phone,
                                    "state": organismFound.State
                                }
                            })
                        }
                        else {
                            var addressFound = rows[0];
                            res.json({
                                "organismeReferent": {
                                    "id": organismFound.Id,
                                    "email": organismFound.Email,
                                    "name": organismFound.Name,
                                    "fax": organismFound.Fax,
                                    "website": organismFound.WebSite,
                                    "phone": organismFound.Phone,
                                    "state": organismFound.State,
                                    "address": { id: addressFound.Id, street: addressFound.Street, city: addressFound.City, nocivique: addressFound.NoCivique, province: addressFound.Province, postalcode: addressFound.PostalCode}
                                }
                            })
                        }
                    })              
                }
            }
        });
    });

    //Delete un Organisme Referent par son id
    api.delete('/organismereferent/delete/:id', (req, res) => {
        var sqlQuery = `DELETE FROM OrganismeReferent WHERE id = ?`;
        var param = req.params.id;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                throw error;
            } else{
                rows.forEach((row) => {
                    printLog(row);
                });
                res.status(200).send({Message: "Delete success"});
            }
        });
    });

    //Vide la table des organismesreferent, utilisés pour les tests
    api.delete("/organismereferent/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM OrganismeReferent", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "OrganismeReferent table cleared" });
            }
        })
    })
};