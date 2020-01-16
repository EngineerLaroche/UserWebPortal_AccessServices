var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'smtp.ets.lab01@gmail.com',
        pass: 'password!123'
    }
});

///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}

module.exports = function (api, db) {
    //Creation d'une demande de service
    api.post('/demandeservice/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")

        printLog("///////Demande de service creation received///////");
        printLog(req.body.demandeservice);
        printLog("///////Parent creation received///////");
        printLog(req.body.demandeservice.parent);
        printLog("///////Parent creation received///////");
        printLog(req.body.demandeservice.secondParent);
        printLog("///////Transport creation received///////");
        printLog(req.body.demandeservice.transport);
        var enfants = req.body.demandeservice.enfants;
        if (enfants.length == 0) {
            res.status(500).send({ error: "Vous devez entré au minimum 1 enfant" })
            return;
        }
        else {
            for (var k = 0; k < enfants.length; k++) {
                printLog("///////Enfant creation received///////");
                printLog(req.body.demandeservice.enfants[k]);
            }
        }
        var date = req.body.demandeservice.date;
        var type = req.body.demandeservice.serviceType.value;
        var frequence = req.body.demandeservice.frequence;
        var noDossierFamille = req.body.demandeservice.noDossierFamille;
        var motifs = req.body.demandeservice.motifs;
        var transport = {
            id: req.body.demandeservice.transport.id,
            name: req.body.demandeservice.transport.name,
            phone: req.body.demandeservice.transport.phone
        }
        if (date == '' || type == '' || frequence == '' || noDossierFamille == '' || motifs == ''
            || transport.name == '' || transport.phone == '') {
            res.status(500).json({ error: "Erreur! Verifié que toutes les informations sont présentes et ré-essayez" })
            return;
        }
        var parent = {};
        var parentAddress = {};
        if (typeof req.body.demandeservice.parent != 'undefined' && typeof req.body.demandeservice.parent.firstname != "undefined" && req.body.demandeservice.parent.firstname != "") {
            parent = {
                firstname: req.body.demandeservice.parent.firstname,
                lastname: req.body.demandeservice.parent.lastname,
                type: req.body.demandeservice.parent.type,
                phone: req.body.demandeservice.parent.phone,
                email: req.body.demandeservice.parent.email,
                birthdate: req.body.demandeservice.parent.birthdate,
                note: req.body.demandeservice.parent.note,
                noLicense: req.body.demandeservice.parent.noLicense,
                noRAMQ: req.body.demandeservice.parent.noRAMQ,
                idcard: req.body.demandeservice.parent.idcard,
                contact: req.body.demandeservice.parent.contact,
                avocat: req.body.demandeservice.parent.avocat
            }
            var disposFirstParent = req.body.demandeservice.dispoFirstParent;
            if (typeof req.body.demandeservice.parent.address != 'undefined') {
                parentAddress = {
                    nocivique: req.body.demandeservice.parent.address.nocivique,
                    street: req.body.demandeservice.parent.address.street,
                    city: req.body.demandeservice.parent.address.city,
                    province: req.body.demandeservice.parent.address.province,
                    postalcode: req.body.demandeservice.parent.address.postalcode
                }
            }
            else {
                res.status(500).json({ error: "L'adresse du premier parent doit être spécifié" })
                return;
            }
        }
        else {
            res.status(500).json({ error: "Les informations du premier parent doivent être spécifié" })
            return;
        }
        var secondParent = {
            firstname: req.body.demandeservice.secondParent.firstname,
            lastname: req.body.demandeservice.secondParent.lastname,
            type: req.body.demandeservice.secondParent.type,
            phone: req.body.demandeservice.secondParent.phone,
            email: req.body.demandeservice.secondParent.email,
            birthdate: req.body.demandeservice.secondParent.birthdate,
            note: req.body.demandeservice.secondParent.note,
            noLicense: req.body.demandeservice.secondParent.noLicense,
            noRAMQ: req.body.demandeservice.secondParent.noRAMQ,
            idcard: req.body.demandeservice.secondParent.idcard,
            contact: req.body.demandeservice.secondParent.contact,
            avocat: req.body.demandeservice.secondParent.avocat
        }
        var disposSecondParent = req.body.demandeservice.dispoSecondParent;
        var secondParentAddress = {
            nocivique: req.body.demandeservice.secondParent.address.nocivique,
            street: req.body.demandeservice.secondParent.address.street,
            city: req.body.demandeservice.secondParent.address.city,
            province: req.body.demandeservice.secondParent.address.province,
            postalcode: req.body.demandeservice.secondParent.address.postalcode
        }
        if (typeof parent.avocat == 'undefined' || typeof parent.firstname == 'undefined' || typeof parent.lastname == 'undefined' || typeof parent.email == 'undefined'
            || typeof parent.phone == 'undefined' || typeof parent.noRAMQ == 'undefined' || typeof parent.noLicense == 'undefined' || typeof parent.contact == 'undefined'
            || typeof parent.birthdate == 'undefined') {
            res.status(500).send({ error: 'Il manque des informations pour le premier parent' })
            return;
        }
        else {
            db.run("INSERT INTO Famille VALUES(?,?)", null, noDossierFamille, function (error) {
                if (error) {
                    printLog(error);
                    res.status(500).json({ error: "Error adding famille to database" });
                }
                else {
                    var familleId = this.lastID;
                    db.run("INSERT INTO Address VALUES(?, ?, ?, ?, ?, ?)", null, parentAddress.nocivique, parentAddress.street, parentAddress.city,
                        parentAddress.province, parentAddress.postalcode, function (error, row) {
                            if (error) {
                                printLog(error);
                                res.status(500).json({ error: "Error adding address to database" });
                            }
                            else {
                                if (error)
                                    res.status(404).json({ "Error with address": error.message });

                                else {
                                    db.run("INSERT INTO Parent VALUES(?, ?, ?, ?, ?, LAST_INSERT_ROWID(), ?, ?, ?, ?, ?, ?, ?, ?)", null, parent.firstname, parent.lastname, parent.phone, parent.email,
                                        parent.birthdate, familleId, parent.note, parent.noLicense, parent.noRAMQ, parent.contact, parent.idcard, parent.type, function (error) {
                                            if (error) {
                                                printLog(error);
                                                res.status(500).json({ error: "Error adding parent" });
                                            }
                                            else {
                                                var parentId = this.lastID;
                                                for (var j = 0; j < parent.avocat.length; j++) {
                                                    db.run("INSERT INTO LienReferentParent VALUES(?,?,?)", null, parent.avocat[j].value, parentId, function (error) {
                                                        if (error) {
                                                            printLog(error);
                                                            res.status(500).json({ error: "Error adding lien entre refererent et parent" });
                                                        }
                                                    })
                                                }
                                                db.run("INSERT INTO DemandeDeService VALUES(?, ?, ?, ?, ?, ?)", null, date, frequence, type, 0, parentId, function (error) {
                                                    if (error) {
                                                        printLog(error);
                                                        res.status(500).json({ error: "Error adding demande de service" });
                                                    }
                                                    else {
                                                        var demandeId = this.lastID;
                                                        if (typeof disposFirstParent != 'undefined' && disposFirstParent.length > 0) {
                                                            for (var i = 0; i < disposFirstParent.length; i++) {
                                                                db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposFirstParent[i].date, disposFirstParent[i].from, disposFirstParent[i].to, demandeId, parentId, function (error) {
                                                                    if (error) {
                                                                        printLog(error);
                                                                        res.status(500).json({ error: "Error adding first parent dispo" });
                                                                    } else {

                                                                    }
                                                                });
                                                            }
                                                        }
                                                        if (typeof (secondParent.firstname) != 'undefined' && typeof (secondParentAddress.nocivique) != 'undefined') {
                                                            db.run("INSERT INTO Address VALUES(?, ?, ?, ?, ?, ?)", null, secondParentAddress.nocivique, secondParentAddress.street, secondParentAddress.city,
                                                                secondParentAddress.province, secondParentAddress.postalcode, function (error, row) {
                                                                    if (error) {
                                                                        printLog(error);
                                                                        res.status(500).json({ error: "Error adding address to database" });
                                                                    } else {
                                                                        var secondParentAdressId = this.lastID;
                                                                        db.run("INSERT INTO Parent VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", null, secondParent.firstname, secondParent.lastname, secondParent.phone, secondParent.email,
                                                                            secondParentAdressId, secondParent.birthdate, familleId, secondParent.note, secondParent.noLicense, secondParent.noRAMQ, secondParent.contact, secondParent.idcard, secondParent.type, function (error) {
                                                                                if (error) {
                                                                                    printLog(error);
                                                                                    res.status(500).json({ error: "Error adding parent" });
                                                                                }
                                                                                else {
                                                                                    var seconParentId = this.lastID;
                                                                                    for (var j = 0; j < secondParent.avocat.length; j++) {
                                                                                        db.run("INSERT INTO LienReferentParent VALUES(?,?,?)", null, secondParent.avocat[j].value, seconParentId, function (error) {
                                                                                            if (error) {
                                                                                                printLog(error);
                                                                                                res.status(500).json({ error: "Error adding lien entre refererent et parent" });
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    db.run("INSERT INTO RoleParentService VALUES(?,?,?,?)", null, demandeId, seconParentId, 1, function (error) {
                                                                                        if (error) {
                                                                                            printLog(error);
                                                                                            res.status(500).json({ error: "Error adding parent service role" });
                                                                                        }
                                                                                    })
                                                                                    if (typeof disposSecondParent != 'undefined' && disposSecondParent.length > 0) {
                                                                                        for (var i = 0; i < disposSecondParent.length; i++) {
                                                                                            db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposSecondParent[i].date, disposSecondParent[i].from, disposSecondParent[i].to, demandeId, seconParentId, function (error) {
                                                                                                if (error) {
                                                                                                    printLog(error);
                                                                                                    res.status(500).json({ error: "Error adding second parent dispo" });
                                                                                                } else {

                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                }
                                                                            });
                                                                    }
                                                                });
                                                        }

                                                        for (var k = 0; k < motifs.length; k++) {
                                                            db.run("INSERT INTO ServiceMotif VALUES(?,?,?)", null, motifs[k].value, demandeId, function (error) {
                                                                if (error) {
                                                                    printLog(error);
                                                                    res.status(500).json({ error: "Error adding service motif" });
                                                                }
                                                            })
                                                        }
                                                        db.run("INSERT INTO RoleParentService VALUES(?,?,?,?)", null, demandeId, parentId, 0, function (error) {
                                                            if (error) {
                                                                printLog(error);
                                                                res.status(500).json({ error: "Error adding parent service role" });
                                                            }
                                                        })
                                                        for (var i = 0; i < enfants.length; i++) {
                                                            db.run("INSERT INTO Enfant VALUES(?,?,?,?,?,?,?,?)", null, enfants[i].firstname, enfants[i].lastname, enfants[i].birthdate, familleId, enfants[i].allergies, enfants[i].noRAMQ, parent.firstname + " " + parent.lastname, function (error) {
                                                                var enfantId = this.lastID
                                                                if (error) {
                                                                    printLog(error);
                                                                    res.status(500).json({ error: "Error adding enfant" });
                                                                } else {
                                                                    db.run("INSERT INTO EnfantService VALUES(?,?,?)", null, demandeId, enfantId, function (error) {
                                                                        if (error) {
                                                                            printLog(error);
                                                                            res.status(500).json({ error: "Error adding enfant service association" });
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                        //si le id du transport a été envoyé ce signifie que le transport existe deja, pas de besoin de le recréé en db juste à créé une association
                                                        if (typeof transport.id != 'undefined') {
                                                            db.run("INSERT INTO TransportService VALUES(?,?,?)", null, transport.id, demandeId, function (error) {
                                                                if (error) {
                                                                    printLog(error);
                                                                    res.status(500).json({ error: "Error adding service transport association" });
                                                                }
                                                            })
                                                        } else {
                                                            db.run("INSERT INTO Transport VALUES(?,?,?)", null, transport.name, transport.phone, function (error) {
                                                                if (error) {
                                                                    printLog(error);
                                                                    res.status(500).json({ error: "Error adding transport" });
                                                                } else {
                                                                    db.run("INSERT INTO TransportService VALUES(?,LAST_INSERT_ROWID(),?)", null, demandeId, function (error) {
                                                                        if (error) {
                                                                            printLog(error);
                                                                            res.status(500).json({ error: "Error adding service transport association" });
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    }
                                                });
                                                res.status(200).json({ Message: "Demande de service completed!" });
                                                db.all("SELECT * FROM User WHERE ROLE = ?", 2, (error, rows) => {
                                                    if (error) {
                                                        printLog(error);
                                                        res.status(500).json({ error: "Error getting coordonator" });
                                                    } else {
                                                        if (rows.length > 0) {
                                                            var coordonator = rows[0];
                                                            var mailOptions = {
                                                                from: 'smtp.ets.lab01@gmail.com',
                                                                to: coordonator.Email,
                                                                subject: 'Demande de service complété',
                                                                text: 'Une nouvelle demande de service a été complété!'
                                                            };
                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                if (error) {
                                                                    printLog(error);
                                                                } else {
                                                                    printLog('Email sent: ' + info.response);
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                }
                            }
                        });
                }
            })
        }

    });

    api.put('/demandeservice/update', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")

        printLog("///////Demande de service update received///////");
        printLog(req.body.demandeservice);
        printLog("///////Parent update received///////");
        printLog(req.body.demandeservice.parent);
        printLog("///////Transport update received///////");
        printLog(req.body.demandeservice.transport);
        var enfants = req.body.demandeservice.enfants;
        if (enfants.length == 0) {
            res.status(500).send({ error: "Vous devez entré au minimum 1 enfant" })
            return;
        }
        else {
            for (var k = 0; k < enfants.length; k++) {
                if (typeof enfants[k].Id != 'undefined')
                    printLog("///////Enfant update received///////");
                else
                    printLog("///////Enfant creation received///////");
                printLog(req.body.demandeservice.enfants[k]);
            }
        }
        var demandeId = req.body.demandeservice.id;
        var date = req.body.demandeservice.date;
        var frequence = req.body.demandeservice.frequence;
        var assumeFrais = req.body.demandeservice.assumeFrais;
        var motifs = req.body.demandeservice.motifs;
        var transport = {
            id: req.body.demandeservice.transport.id,
            name: req.body.demandeservice.transport.name,
            phone: req.body.demandeservice.transport.phone
        }
        if (date == '' || frequence == '' || motifs == ''
            || transport.name == '' || transport.phone == '') {
            res.status(500).json({ error: "Erreur! Verifié que toutes les informations sont présentes et ré-essayez" })
            return;
        }
        var parent = {};
        var parentAddress = {};
        var disposSecondParent = req.body.demandeservice.dispoSecondParent;
        var disposFirstParent = req.body.demandeservice.dispoFirstParent;
        if (typeof req.body.demandeservice.parent != 'undefined') {
            parent = {
                id: req.body.demandeservice.parent.id,
                type: req.body.demandeservice.parent.type,
                familleId: req.body.demandeservice.parent.familleId,
                firstname: req.body.demandeservice.parent.firstname,
                lastname: req.body.demandeservice.parent.lastname,
                phone: req.body.demandeservice.parent.phone,
                email: req.body.demandeservice.parent.email,
                birthdate: req.body.demandeservice.parent.birthdate,
                note: req.body.demandeservice.parent.note,
                noLicense: req.body.demandeservice.parent.noPermisConduire,
                noRAMQ: req.body.demandeservice.parent.noRAMQ,
                idcard: req.body.demandeservice.parent.idcard,
                contact: req.body.demandeservice.parent.contact
            }
            if (typeof req.body.demandeservice.parent.address != 'undefined') {
                parentAddress = {
                    id: req.body.demandeservice.parent.id,
                    nocivique: req.body.demandeservice.parent.address.nocivique,
                    street: req.body.demandeservice.parent.address.street,
                    city: req.body.demandeservice.parent.address.city,
                    province: req.body.demandeservice.parent.address.province,
                    postalcode: req.body.demandeservice.parent.address.postalcode
                }
            } else {
                res.status(500).json({ error: "L'adresse du premier parent doit être spécifié" })
            }
        } else {
            res.status(500).json({ error: "Les informations du premier parent doivent être spécifiées" })
        }
        if (parent.avocat == '' || parent.firstname == '' || parent.lastname == '' || parent.email == ''
            || parent.phone == '' || parent.noRAMQ == '' || parent.noLicense == '' || parent.contact == ''
            || parent.birthdate == '') {
            res.status(500).send({ error: 'Il manque des informations pour le premier parent' })
            return;
        }
        var secondParent = {};
        var secondParentAddress = {};
        if (typeof req.body.demandeservice.secondParent != 'undefined') {
            secondParent = {
                id: req.body.demandeservice.secondParent.id,
                type: req.body.demandeservice.secondParent.type,
                firstname: req.body.demandeservice.secondParent.firstname,
                lastname: req.body.demandeservice.secondParent.lastname,
                phone: req.body.demandeservice.secondParent.phone,
                email: req.body.demandeservice.secondParent.email,
                birthdate: req.body.demandeservice.secondParent.birthdate,
                note: req.body.demandeservice.secondParent.note,
                noLicense: req.body.demandeservice.secondParent.noPermisConduire,
                noRAMQ: req.body.demandeservice.secondParent.noRAMQ,
                idcard: req.body.demandeservice.secondParent.idcard,
                contact: req.body.demandeservice.secondParent.contact
            }
            if (typeof req.body.demandeservice.secondParent.address != 'undefined') {
                secondParentAddress = {
                    id: req.body.demandeservice.secondParent.address.id,
                    nocivique: req.body.demandeservice.secondParent.address.nocivique,
                    street: req.body.demandeservice.secondParent.address.street,
                    city: req.body.demandeservice.secondParent.address.city,
                    province: req.body.demandeservice.secondParent.address.province,
                    postalcode: req.body.demandeservice.secondParent.address.postalcode
                }
            } else {
                res.status(500).json({ error: "L'adresse du second parent doit être spécifié" });
            }
        }
        db.run("UPDATE Address SET NoCivique = ?, Street = ?, City = ?, Province = ?, PostalCode = ? WHERE Id = ?", parentAddress.nocivique, parentAddress.street, parentAddress.city,
            parentAddress.province, parentAddress.postalcode, parentAddress.Id, function (error, row) {
                if (error) {
                    printLog(error);
                    res.status(500).json({ error: "Error updating address in database" });
                }
                else {
                    db.run("UPDATE Parent SET Firstname = ?, Lastname = ?, Phone = ?, Email = ?, BirthDate = ?, NoteSpecifique = ?, NoPermisConduire = ?, NoRAMQ = ?, ContactUrgence = ?, CarteIdentite = ?, Type = ? WHERE Id = ?", parent.firstname, parent.lastname, parent.phone, parent.email,
                        parent.birthdate, parent.note, parent.noLicense, parent.noRAMQ, parent.contact, parent.idcard, parent.type, parent.id, function (error) {
                            if (error) {
                                printLog(error);
                                res.status(500).json({ error: "Error updating parent" });
                            }
                            else {
                                db.run("DELETE FROM ServiceMotif WHERE ServiceId = ?", demandeId, function (error) {
                                    if (error)
                                        res.status(500).json({ error: "Error updating motifs" })
                                    else {
                                        for (var k = 0; k < motifs.length; k++) {
                                            db.run("INSERT INTO ServiceMotif VALUES(?,?,?)", null, motifs[k].value, demandeId, function (error) {
                                                if (error) {
                                                    printLog(error);
                                                    res.status(500).json({ error: "Error adding service motif" });
                                                }
                                            })
                                        }
                                        db.run("UPDATE DemandeDeService Set Date = ?, Frequence = ?, AssumeFrais = ? WHERE Id = ?", date, frequence, assumeFrais, demandeId, function (error) {
                                            if (error) {
                                                printLog(error);
                                                res.status(500).json({ error: "Error updating demande de service" });
                                            }
                                            else {
                                                for (var i = 0; i < enfants.length; i++) {
                                                    if (typeof enfants[i].Id != 'undefined') {
                                                        db.run("UPDATE Enfant SET Firstname = ?, Lastname = ?, BirthDate = ?, Famille = ?, Allergies = ?, NoRAMQ = ?, Garde = ? WHERE Id = ?", enfants[i].Firstname, enfants[i].Lastname, enfants[i].BirthDate, enfants[i].Famille, enfants[i].Allergies, enfants[i].NoRAMQ, enfants[i].Garde, enfants[i].Id, function (error) {
                                                            if (error) {
                                                                printLog(error);
                                                                res.status(500).json({ error: "Error adding enfant" });
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        db.run("INSERT INTO Enfant VALUES(?,?,?,?,?,?,?,?)", null, enfants[i].Firstname, enfants[i].Lastname, enfants[i].BirthDate, enfants[i].Famille, enfants[i].Allergies, enfants[i].NoRAMQ, enfants[i].Garde, function (error) {
                                                            var enfantId = this.lastID
                                                            if (error) {
                                                                printLog(error);
                                                                res.status(500).json({ error: "Error adding enfant" });
                                                            } else {
                                                                db.run("INSERT INTO EnfantService VALUES(?,?,?)", null, demandeId, enfantId, function (error) {
                                                                    if (error) {
                                                                        printLog(error);
                                                                        res.status(500).json({ error: "Error adding enfant service association" });
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                }
                                                db.run("DELETE FROM Disponibilite WHERE DemandeServiceId = ?", demandeId, function (error, rows) {
                                                    if (error) {
                                                        printLog(error);
                                                        res.status(500).json({ error: "Error updating parent" });
                                                    } else {
                                                        if (typeof disposFirstParent != 'undefined' && disposFirstParent.length > 0) {
                                                            for (var i = 0; i < disposFirstParent.length; i++) {
                                                                db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposFirstParent[i].Date, disposFirstParent[i].From, disposFirstParent[i].To, demandeId, parent.id, function (error) {
                                                                    if (error) {
                                                                        printLog(error);
                                                                        res.status(500).json({ error: "Error adding first parent dispo" });
                                                                    } else {

                                                                    }
                                                                })
                                                            }
                                                            //if the second parent was already defined and only needs to be updated
                                                            if (typeof (secondParent.id) != 'undefined' && typeof (secondParentAddress.id) != 'undefined') {
                                                                db.run("UPDATE Address Set NoCivique = ?, Street = ?, City = ?, Province = ?, PostalCode = ? WHERE Id = ?", secondParentAddress.nocivique, secondParentAddress.street, secondParentAddress.city,
                                                                    secondParentAddress.province, secondParentAddress.postalcode, secondParentAddress.id, function (error, row) {
                                                                        if (error) {
                                                                            printLog(error);
                                                                            res.status(500).json({ error: "Error updating address in database" });
                                                                        } else {
                                                                            db.run("UPDATE Parent Set Firstname = ?, Lastname = ?, Phone = ?, Email = ?, BirthDate = ?, NoteSpecifique = ?, NoPermisConduire = ?, NoRAMQ = ?, ContactUrgence = ?, CarteIdentite = ?, Type = ? WHERE Id = ?", secondParent.firstname, secondParent.lastname, secondParent.phone, secondParent.email,
                                                                                secondParent.birthdate, secondParent.note, secondParent.noLicense, secondParent.noRAMQ, secondParent.contact, secondParent.idcard, secondParent.type, secondParent.id, function (error) {
                                                                                    if (error) {
                                                                                        printLog(error);
                                                                                        res.status(500).json({ error: "Error updating parent" });
                                                                                    }
                                                                                    else {

                                                                                        if (typeof disposSecondParent != 'undefined' && disposSecondParent.length > 0) {
                                                                                            for (var i = 0; i < disposSecondParent.length; i++) {
                                                                                                db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposSecondParent[i].Date, disposSecondParent[i].From, disposSecondParent[i].To, demandeId, secondParent.id, function (error) {
                                                                                                    if (error) {
                                                                                                        printLog(error);
                                                                                                        res.status(500).json({ error: "Error adding second parent dispo" });
                                                                                                    } else {

                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                                if (error) {
                                                                                                    printLog(error);
                                                                                                    res.status(500).json({ error: "Error updating service transport" });
                                                                                                } else {
                                                                                                    res.status(200).json({
                                                                                                        Message: "Demande de service updated!",
                                                                                                        Id: demandeId
                                                                                                    });
                                                                                                }
                                                                                            })

                                                                                        }
                                                                                    }
                                                                                });
                                                                        }
                                                                    });
                                                                //If the second parent id is not defined it means the parent hasn't been added to the database yet so we add it instead of trying to update it
                                                            } else {
                                                                if (typeof (secondParentAddress.id) == 'undefined') {
                                                                    db.run("INSERT INTO Address VALUES(?, ?, ?, ?, ?, ?)", null, secondParentAddress.nocivique, secondParentAddress.street, secondParentAddress.city,
                                                                        secondParentAddress.province, secondParentAddress.postalcode, function (error, row) {
                                                                            if (error) {
                                                                                printLog(error);
                                                                                res.status(500).json({ error: "Error adding address to database" });
                                                                            } else {
                                                                                var secondParentAdressId = this.lastID;
                                                                                db.run("UPDATE Parent SET Firstname = ?, Lastname = ?, Phone = ?, Email = ?, BirthDate = ?, NoteSpecifique = ?, NoPermisConduire = ?, NoRAMQ = ?, ContactUrgence = ?, CarteIdentite = ?, Type = ? WHERE Id = ?", secondParent.firstname, secondParent.lastname, secondParent.phone, secondParent.email,
                                                                                    secondParentAdressId, secondParent.birthdate, parent.familleId, secondParent.note, secondParent.noLicense, secondParent.noRAMQ, secondParent.contact, secondParent.idcard, 1, secondParent.id, function (error) {
                                                                                        if (error) {
                                                                                            printLog(error);
                                                                                            res.status(500).json({ error: "Error adding parent" });
                                                                                        }
                                                                                        else {
                                                                                            var seconParentId = this.lastID;
                                                                                            db.run("INSERT INTO RoleParentService VALUES(?,?,?,?)", null, demandeId, seconParentId, 1, function (error) {
                                                                                                if (error) {
                                                                                                    printLog(error);
                                                                                                    res.status(500).json({ error: "Error adding parent service role" });
                                                                                                } else {
                                                                                                    if (typeof disposSecondParent != 'undefined' && disposSecondParent.length > 0) {
                                                                                                        for (var i = 0; i < disposSecondParent.length; i++) {
                                                                                                            db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposSecondParent[i].Date, disposSecondParent[i].From, disposSecondParent[i].To, demandeId, secondParent.id, function (error) {
                                                                                                                if (error) {
                                                                                                                    printLog(error);
                                                                                                                    res.status(500).json({ error: "Error adding second parent dispo" });
                                                                                                                } else {

                                                                                                                }
                                                                                                            })
                                                                                                        }
                                                                                                        db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                                            if (error) {
                                                                                                                printLog(error);
                                                                                                                res.status(500).json({ error: "Error updating service transport" });
                                                                                                            } else {
                                                                                                                res.status(200).json({
                                                                                                                    Message: "Demande de service updated!",
                                                                                                                    Id: demandeId
                                                                                                                });
                                                                                                            }
                                                                                                        })

                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    });
                                                                            }
                                                                        });
                                                                } else {
                                                                    db.run("INSERT INTO Parent VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", null, secondParent.firstname, secondParent.lastname, secondParent.phone, secondParent.email,
                                                                        secondParentAdress.id, secondParent.birthdate, parent.familleId, secondParent.note, secondParent.noLicense, secondParent.noRAMQ, secondParent.contact, secondParent.idcard, function (error) {
                                                                            if (error) {
                                                                                printLog(error);
                                                                                res.status(500).json({ error: "Error adding parent" });
                                                                            }
                                                                            else {
                                                                                var seconParentId = this.lastID;
                                                                                db.run("INSERT INTO RoleParentService VALUES(?,?,?,?)", null, demandeId, seconParentId, 1, function (error) {
                                                                                    if (error) {
                                                                                        printLog(error);
                                                                                        res.status(500).json({ error: "Error adding parent service role" });
                                                                                    } else {
                                                                                        if (typeof disposSecondParent != 'undefined' && disposSecondParent.length > 0) {
                                                                                            for (var i = 0; i < disposSecondParent.length; i++) {
                                                                                                db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposSecondParent[i].Date, disposSecondParent[i].From, disposSecondParent[i].To, demandeId, secondParent.id, function (error) {
                                                                                                    if (error) {
                                                                                                        printLog(error);
                                                                                                        res.status(500).json({ error: "Error adding second parent dispo" });
                                                                                                    } else {

                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                                if (error) {
                                                                                                    printLog(error);
                                                                                                    res.status(500).json({ error: "Error updating service transport" });
                                                                                                } else {
                                                                                                    res.status(200).json({
                                                                                                        Message: "Demande de service updated!",
                                                                                                        Id: demandeId
                                                                                                    });
                                                                                                }
                                                                                            })

                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        });
                                                                }
                                                            }
                                                        } else {
                                                            //if the second parent was already defined and only needs to be updated
                                                            if (typeof (secondParent.id) != 'undefined' && typeof (secondParentAddress.id) != 'undefined') {
                                                                db.run("UPDATE Address Set NoCivique = ?, Street = ?, City = ?, Province = ?, PostalCode = ? WHERE Id = ?", secondParentAddress.nocivique, secondParentAddress.street, secondParentAddress.city,
                                                                    secondParentAddress.province, secondParentAddress.postalcode, secondParentAddress.id, function (error, row) {
                                                                        if (error) {
                                                                            printLog(error);
                                                                            res.status(500).json({ error: "Error updating address in database" });
                                                                        } else {
                                                                            db.run("UPDATE Parent Set Firstname = ?, Lastname = ?, Phone = ?, Email = ?, BirthDate = ?, NoteSpecifique = ?, NoPermisConduire = ?, NoRAMQ = ?, ContactUrgence = ?, CarteIdentite = ? WHERE Id = ?", secondParent.firstname, secondParent.lastname, secondParent.phone, secondParent.email,
                                                                                secondParent.birthdate, secondParent.note, secondParent.noLicense, secondParent.noRAMQ, secondParent.contact, secondParent.idcard, secondParent.id, function (error) {
                                                                                    if (error) {
                                                                                        printLog(error);
                                                                                        res.status(500).json({ error: "Error updating parent" });
                                                                                    }
                                                                                    else {
                                                                                        if (typeof disposSecondParent != 'undefined' && disposSecondParent.length > 0) {
                                                                                            for (var i = 0; i < disposSecondParent.length; i++) {
                                                                                                db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposSecondParent[i].Date, disposSecondParent[i].From, disposSecondParent[i].To, demandeId, secondParent.id, function (error) {
                                                                                                    if (error) {
                                                                                                        printLog(error);
                                                                                                        res.status(500).json({ error: "Error adding second parent dispo" });
                                                                                                    } else {

                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                        db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                            if (error) {
                                                                                                printLog(error);
                                                                                                res.status(500).json({ error: "Error updating service transport" });
                                                                                            } else {
                                                                                                res.status(200).json({
                                                                                                    Message: "Demande de service updated!",
                                                                                                    Id: demandeId
                                                                                                });
                                                                                            }
                                                                                        })

                                                                                    }
                                                                                });
                                                                        }
                                                                    });
                                                                //If the second parent id is not defined it means the parent hasn't been added to the database yet so we add it instead of trying to update it
                                                            } else {
                                                                if (typeof (secondParentAddress.id) == 'undefined') {
                                                                    db.run("INSERT INTO Address VALUES(?, ?, ?, ?, ?, ?)", null, secondParentAddress.nocivique, secondParentAddress.street, secondParentAddress.city,
                                                                        secondParentAddress.province, secondParentAddress.postalcode, function (error, row) {
                                                                            if (error) {
                                                                                printLog(error);
                                                                                res.status(500).json({ error: "Error adding address to database" });
                                                                            } else {
                                                                                var secondParentAdressId = this.lastID;
                                                                                db.run("INSERT INTO Parent VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", null, secondParent.firstname, secondParent.lastname, secondParent.phone, secondParent.email,
                                                                                    secondParentAdressId, secondParent.birthdate, parent.familleId, secondParent.note, secondParent.noLicense, secondParent.noRAMQ, secondParent.contact, secondParent.idcard, 1, function (error) {
                                                                                        if (error) {
                                                                                            printLog(error);
                                                                                            res.status(500).json({ error: "Error adding parent" });
                                                                                        }
                                                                                        else {
                                                                                            var seconParentId = this.lastID;
                                                                                            db.run("INSERT INTO RoleParentService VALUES(?,?,?,?)", null, demandeId, seconParentId, 1, function (error) {
                                                                                                if (error) {
                                                                                                    printLog(error);
                                                                                                    res.status(500).json({ error: "Error adding parent service role" });
                                                                                                } else {
                                                                                                    if (typeof disposSecondParent != 'undefined' && disposSecondParent.length > 0) {
                                                                                                        for (var i = 0; i < disposSecondParent.length; i++) {
                                                                                                            db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposSecondParent[i].Date, disposSecondParent[i].From, disposSecondParent[i].To, demandeId, secondParent.id, function (error) {
                                                                                                                if (error) {
                                                                                                                    printLog(error);
                                                                                                                    res.status(500).json({ error: "Error adding second parent dispo" });
                                                                                                                } else {

                                                                                                                }
                                                                                                            })
                                                                                                        }
                                                                                                        db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                                            if (error) {
                                                                                                                printLog(error);
                                                                                                                res.status(500).json({ error: "Error updating service transport" });
                                                                                                            } else {
                                                                                                                res.status(200).json({
                                                                                                                    Message: "Demande de service updated!",
                                                                                                                    Id: demandeId
                                                                                                                });
                                                                                                            }
                                                                                                        })

                                                                                                    } else {
                                                                                                        db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                                            if (error) {
                                                                                                                printLog(error);
                                                                                                                res.status(500).json({ error: "Error updating service transport" });
                                                                                                            } else {
                                                                                                                res.status(200).json({
                                                                                                                    Message: "Demande de service updated!",
                                                                                                                    Id: demandeId
                                                                                                                });
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    });
                                                                            }
                                                                        });
                                                                } else {
                                                                    db.run("INSERT INTO Parent VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", null, secondParent.firstname, secondParent.lastname, secondParent.phone, secondParent.email,
                                                                        secondParentAdress.id, secondParent.birthdate, parent.familleId, secondParent.note, secondParent.noLicense, secondParent.noRAMQ, secondParent.contact, secondParent.idcard, function (error) {
                                                                            if (error) {
                                                                                printLog(error);
                                                                                res.status(500).json({ error: "Error adding parent" });
                                                                            }
                                                                            else {
                                                                                var seconParentId = this.lastID;
                                                                                db.run("INSERT INTO RoleParentService VALUES(?,?,?,?)", null, demandeId, seconParentId, 1, function (error) {
                                                                                    if (error) {
                                                                                        printLog(error);
                                                                                        res.status(500).json({ error: "Error adding parent service role" });
                                                                                    } else {
                                                                                        if (typeof disposSecondParent != 'undefined' && disposSecondParent.length > 0) {
                                                                                            for (var i = 0; i < disposSecondParent.length; i++) {
                                                                                                db.run("INSERT INTO Disponibilite VALUES(?, ?, ?, ?, ?, ?)", null, disposSecondParent[i].Date, disposSecondParent[i].From, disposSecondParent[i].To, demandeId, secondParent.id, function (error) {
                                                                                                    if (error) {
                                                                                                        printLog(error);
                                                                                                        res.status(500).json({ error: "Error adding second parent dispo" });
                                                                                                    } else {

                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                                if (error) {
                                                                                                    printLog(error);
                                                                                                    res.status(500).json({ error: "Error updating service transport" });
                                                                                                } else {
                                                                                                    res.status(200).json({
                                                                                                        Message: "Demande de service updated!",
                                                                                                        Id: demandeId
                                                                                                    });
                                                                                                }
                                                                                            })

                                                                                        } else {
                                                                                            db.run("UPDATE Transport SET Name = ?, Phone = ? WHERE Id = ?", transport.name, transport.phone, transport.id, function (error) {
                                                                                                if (error) {
                                                                                                    printLog(error);
                                                                                                    res.status(500).json({ error: "Error updating service transport" });
                                                                                                } else {
                                                                                                    res.status(200).json({
                                                                                                        Message: "Demande de service updated!",
                                                                                                        Id: demandeId
                                                                                                    });
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        });
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        })
                }
            });
    });


    //Vide la table des demande de service, utilisés pour les tests
    api.delete("/demandeservice/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM DemandeDeService", (error, rows) => {
            if (error) {
                console.log(error);
                res.status(500).send({ error: "Error" });
            } else {
                db.all("DELETE FROM ServiceMotif", (error, rows) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send({ error: "Error" });
                    } else {
                        res.status(200).json({
                            Message: "Wiped demande de service table!"
                        })
                    }
                });
            }
        });
    });

    api.delete("/transport/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM TransportService", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                db.all("DELETE FROM Transport", (error, rows) => {
                    if (error) {
                        res.status(500).send({ error: "Error" });
                    } else {
                        res.status(200).send({ Message: "success" });
                    }
                });
            }
        });
    })

    api.get("/motifs", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("GET Motifs");
        db.all("SELECT Id, Type FROM Motif", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error getting motifs" });
            } else {
                res.status(200).send({ Motifs: rows });
            }
        });

    })

    api.post("/motifs/add", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("///ADD Motifs///");
        printLog(req.body.newMotif);
        var motif = req.body.newMotif;
        if (typeof motif != 'undefined' && motif != "") {
            db.all("INSERT INTO MOTIF VALUES (?, ?)", null, motif, (error, rows) => {
                if (error) {
                    res.status(500).send({ error: "Error adding motif" });
                } else {
                    res.status(200).send({ Message: "Motif ajouté avec succès, veullez le sélectionner dans la liste maintenant" });
                }
            });
        } else {
            res.status(500).send({ error: "Vous devez spécifié un motif valide pour le créer" })
        }

    })

    api.get("/demandeservices", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("GET Demandes de service");
        db.all("SELECT * FROM DemandeDeService WHERE Id > ?", 0, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error getting motifs" });
            } else {
                res.status(200).send({ DemandeServices: rows });
            }
        });

    })

    api.get("/demandeservice/:id", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("GET Demandes de service");
        var param = req.params.id;
        db.all("SELECT * FROM DemandeDeService WHERE Id = ?", param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error getting motifs" });
            } else {
                //Si aucune demande trouvée avec le id
                if (rows.length == 0)
                    res.status(200).send({ error: "Aucune demande de service trouvée" });
                //Sinon en renvoit les informations de la demande trouvée
                else {
                    var demandeService = rows[0];
                    printLog("Found: " + demandeService.Date);
                    db.all("SELECT * FROM ServiceMotif WHERE ServiceId = ?", demandeService.Id, (error, rows) => {
                        if (error) {
                            printLog("Error getting motifs with service Id: " + demandeService.Id);
                        } else {
                            var motifs = [];
                            var motifsService = rows;
                            for (var k = 0; k < motifsService.length; k++) {
                                db.all("SELECT Id, Type FROM Motif WHERE Id = ?", motifsService[k].MotifId, (error, rows) => {
                                    if (error) {
                                        printLog("Error getting motif with Id: " + motifsService[k].Id);
                                    } else {
                                        motifs.push(rows[0])
                                    }
                                });
                            }
                            db.all("SELECT * FROM RoleParentService WHERE ServiceId = ? AND Role = ?", demandeService.Id, 0, (error, rows) => {
                                if (error) {
                                    res.status(500).send({ error: "Error getting role parent service" });
                                } else {
                                    //Si aucune demande trouvée avec le id
                                    if (rows.length == 0)
                                        res.status(500).send({ error: "Aucune parent demandeur de ce service trouvée" });
                                    else {
                                        var firstParentId = rows[0];
                                        db.all("SELECT * FROM Parent WHERE Id = ?", firstParentId.Id, (error, rows) => {
                                            //Si aucune demande trouvée avec le id
                                            if (rows.length == 0)
                                                res.status(500).send({ error: "Aucune parent demandeur de ce service trouvée" });
                                            else {
                                                var firstParent = rows[0];
                                                db.all("SELECT * FROM Address WHERE Id = ?", firstParent.Address, (error, rows) => {
                                                    if (error) {
                                                        res.status(500).send({ error: "Error getting parent address" });
                                                    } else {
                                                        var firstParentAddress = rows[0];
                                                        db.all("SELECT * FROM Famille WHERE Id = ?", firstParent.Famille, (error, rows) => {
                                                            if (error) {
                                                                res.status(500).send({ error: "Error getting famille" });
                                                            }
                                                            else {
                                                                if (rows.length == 0)
                                                                    var famille = {};
                                                                else
                                                                    var famille = rows[0];

                                                                db.all("SELECT * FROM LienReferentParent WHERE ParentId = ?", firstParent.Id, (error, rows) => {
                                                                    if (error) {
                                                                        res.status(500).send({ error: "Error getting first parent dispos" });
                                                                    }
                                                                    else {
                                                                        var firstParentAvocatsLinks = rows;
                                                                        var firstParentAvocats = [];
                                                                        for (var k = 0; k < firstParentAvocatsLinks.length; k++) {
                                                                            db.all("SELECT * FROM Referent WHERE Id = ?", firstParentAvocatsLinks[k].ReferentId, (error, rows) => {
                                                                                if (error) {
                                                                                    res.status(500).send({ error: "Error getting parent referent avocat" });
                                                                                }
                                                                                else {
                                                                                    firstParentAvocats.push(rows[0]);
                                                                                }
                                                                            })
                                                                        }
                                                                        db.all("SELECT * FROM Disponibilite WHERE DemandeServiceId = ? AND ParentId = ?", demandeService.Id, firstParent.Id, (error, rows) => {
                                                                            if (error) {
                                                                                res.status(500).send({ error: "Error getting first parent dispos" });
                                                                            } else {
                                                                                printLog("Dispos: " + rows.length);
                                                                                if (rows.length == 0)
                                                                                    var firstParentDispos = [];
                                                                                else
                                                                                    var firstParentDispos = rows;

                                                                                db.all("SELECT * FROM RoleParentService WHERE ServiceId = ? AND Role = ?", demandeService.Id, 1, (error, rows) => {
                                                                                    if (error) {
                                                                                        res.status(500).send({ error: "Error getting role parent service" });
                                                                                    } else {
                                                                                        var secondParent;
                                                                                        var secondParentDispos;
                                                                                        var secondParentAddress;
                                                                                        var secondParentAvocats;
                                                                                        if (rows.length == 0) {
                                                                                            secondParent = {
                                                                                                Firstname: "",
                                                                                                Lastname: "",
                                                                                                Phone: "",
                                                                                                Email: "",
                                                                                                BirthDate: "",
                                                                                                Note: "",
                                                                                                NoPermisConduire: "",
                                                                                                NoRAMQ: "",
                                                                                                Idcard: "",
                                                                                                Contact: ""
                                                                                            }
                                                                                            secondParentDispos = [];
                                                                                            secondParentAddress = {
                                                                                                NoCivique: '',
                                                                                                City: '',
                                                                                                Street: '',
                                                                                                PostalCode: '',
                                                                                                Province: '',
                                                                                            }
                                                                                            secondParentAvocats = [];
                                                                                            db.all("SELECT * FROM EnfantService WHERE ServiceId = ?", demandeService.Id, (error, rows) => {
                                                                                                if (error) {
                                                                                                    res.status(500).send({ error: "Error getting enfants service" });
                                                                                                } else {
                                                                                                    var enfants = [];
                                                                                                    for (var k = 0; k < rows.length; k++) {
                                                                                                        db.all("SELECT * FROM Enfant WHERE Id = ?", rows[k].Id, (error, rows) => {
                                                                                                            if (error) {
                                                                                                                printLog("Error getting enfant with Id: " + rows[k].Id);
                                                                                                            } else {
                                                                                                                enfants.push(rows[0])
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                    db.all("SELECT * FROM TransportService WHERE ServiceId = ?", demandeService.Id, (error, rows) => {
                                                                                                        if (error) {
                                                                                                            res.status(500).send({ error: "Error getting transport service" });
                                                                                                        } else {
                                                                                                            var transportService = rows[0];
                                                                                                            db.all("SELECT * FROM Transport WHERE Id = ?", transportService.Id, (error, rows) => {
                                                                                                                if (error) {
                                                                                                                    printLog("Error getting transport with Id: " + transportService.Id);
                                                                                                                } else {
                                                                                                                    if (rows.length == 0)
                                                                                                                        var transport = '';
                                                                                                                    else {
                                                                                                                        var transport = rows[0];
                                                                                                                    }
                                                                                                                    res.json({
                                                                                                                        DemandeDeService: {
                                                                                                                            Id: demandeService.Id,
                                                                                                                            Famille: famille,
                                                                                                                            Date: demandeService.Date,
                                                                                                                            Frequence: demandeService.Frequence,
                                                                                                                            AssumeFrais: demandeService.AssumeFrais,
                                                                                                                            ServiceType: demandeService.Type,
                                                                                                                            Enfants: enfants,
                                                                                                                            FirstParent: firstParent,
                                                                                                                            FirstParentAvocats: firstParentAvocats,
                                                                                                                            FirstParentAddress: firstParentAddress,
                                                                                                                            FirstParentDispos: firstParentDispos,
                                                                                                                            SecondParent: secondParent,
                                                                                                                            SecondParentAvocats: secondParentAvocats,
                                                                                                                            SecondParentAddress: secondParentAddress,
                                                                                                                            SecondParentDispos: secondParentDispos,
                                                                                                                            Transport: transport,
                                                                                                                            Motifs: motifs
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }

                                                                                        else {
                                                                                            var secondParentId = rows[0];
                                                                                            db.all("SELECT * FROM Parent WHERE Id = ?", secondParentId.Id, (error, rows) => {
                                                                                                var secondParent = rows[0];
                                                                                                db.all("SELECT * FROM Address WHERE Id = ?", secondParent.Address, (error, rows) => {
                                                                                                    if (error) {
                                                                                                        res.status(500).send({ error: "Error getting second parent address" });
                                                                                                    } else {
                                                                                                        var secondParentAddress = rows[0];

                                                                                                        db.all("SELECT * FROM LienReferentParent WHERE ParentId = ?", secondParent.Id, (error, rows) => {
                                                                                                            if (error) {
                                                                                                                res.status(500).send({ error: "Error getting second parent avocat" });
                                                                                                            }
                                                                                                            else {
                                                                                                                var secondParentAvocatsLinks = rows;
                                                                                                                var secondParentAvocats = [];
                                                                                                                for (var k = 0; k < secondParentAvocatsLinks.length; k++) {
                                                                                                                    db.all("SELECT * FROM Referent WHERE Id = ?", secondParentAvocatsLinks[k].ReferentId, (error, rows) => {
                                                                                                                        if (error) {
                                                                                                                            res.status(500).send({ error: "Error getting parent referent avocat" });
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            secondParentAvocats.push(rows[0]);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                db.all("SELECT * FROM Disponibilite WHERE DemandeServiceId = ? AND ParentId = ?", demandeService.Id, secondParent.Id, (error, rows) => {
                                                                                                                    if (error) {
                                                                                                                        res.status(500).send({ error: "Error getting second parent dispos" });
                                                                                                                    } else {
                                                                                                                        if (rows.length == 0)
                                                                                                                            var secondParentDispos = [];
                                                                                                                        else
                                                                                                                            var secondParentDispos = rows;
                                                                                                                        db.all("SELECT * FROM EnfantService WHERE ServiceId = ?", demandeService.Id, (error, rows) => {
                                                                                                                            if (error) {
                                                                                                                                res.status(500).send({ error: "Error getting enfants service" });
                                                                                                                            } else {
                                                                                                                                var enfants = [];
                                                                                                                                for (var k = 0; k < rows.length; k++) {
                                                                                                                                    db.all("SELECT * FROM Enfant WHERE Id = ?", rows[k].Id, (error, rows) => {
                                                                                                                                        if (error) {
                                                                                                                                            printLog("Error getting enfant with Id: " + rows[k].Id);
                                                                                                                                        } else {
                                                                                                                                            enfants.push(rows[0])
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                }
                                                                                                                                db.all("SELECT * FROM TransportService WHERE ServiceId = ?", demandeService.Id, (error, rows) => {
                                                                                                                                    if (error) {
                                                                                                                                        res.status(500).send({ error: "Error getting transport service" });
                                                                                                                                    } else {
                                                                                                                                        var transportService = rows[0];
                                                                                                                                        db.all("SELECT * FROM Transport WHERE Id = ?", transportService.Id, (error, rows) => {
                                                                                                                                            if (error) {
                                                                                                                                                printLog("Error getting transport with Id: " + transportService.Id);
                                                                                                                                            } else {
                                                                                                                                                if (rows.length == 0)
                                                                                                                                                    var transport = '';
                                                                                                                                                else {
                                                                                                                                                    var transport = rows[0];
                                                                                                                                                }
                                                                                                                                                var x = {
                                                                                                                                                    Id: demandeService.Id,
                                                                                                                                                    Famille: famille,
                                                                                                                                                    Date: demandeService.Date,
                                                                                                                                                    Frequence: demandeService.Frequence,
                                                                                                                                                    AssumeFrais: demandeService.AssumeFrais,
                                                                                                                                                    ServiceType: demandeService.Type,
                                                                                                                                                    Enfants: enfants,
                                                                                                                                                    FirstParent: firstParent,
                                                                                                                                                    FirstParentAddress: firstParentAddress,
                                                                                                                                                    FirstParentDispos: firstParentDispos,
                                                                                                                                                    FirstParentAvocats: firstParentAvocats,
                                                                                                                                                    SecondParent: secondParent,
                                                                                                                                                    SecondParentAddress: secondParentAddress,
                                                                                                                                                    SecondParentDispos: secondParentDispos,
                                                                                                                                                    SecondParentAvocats: secondParentAvocats,
                                                                                                                                                    Transport: transport,
                                                                                                                                                    Motifs: motifs
                                                                                                                                                }
                                                                                                                                                printLog(x);
                                                                                                                                                res.json({
                                                                                                                                                    DemandeDeService: {
                                                                                                                                                        Id: demandeService.Id,
                                                                                                                                                        Famille: famille,
                                                                                                                                                        Date: demandeService.Date,
                                                                                                                                                        Frequence: demandeService.Frequence,
                                                                                                                                                        AssumeFrais: demandeService.AssumeFrais,
                                                                                                                                                        ServiceType: demandeService.Type,
                                                                                                                                                        Enfants: enfants,
                                                                                                                                                        FirstParent: firstParent,
                                                                                                                                                        FirstParentAddress: firstParentAddress,
                                                                                                                                                        FirstParentDispos: firstParentDispos,
                                                                                                                                                        FirstParentAvocats: firstParentAvocats,
                                                                                                                                                        SecondParent: secondParent,
                                                                                                                                                        SecondParentAddress: secondParentAddress,
                                                                                                                                                        SecondParentDispos: secondParentDispos,
                                                                                                                                                        SecondParentAvocats: secondParentAvocats,
                                                                                                                                                        Transport: transport,
                                                                                                                                                        Motifs: motifs
                                                                                                                                                    }
                                                                                                                                                })
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        })

                                                                                                    }
                                                                                                });
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    })
}
