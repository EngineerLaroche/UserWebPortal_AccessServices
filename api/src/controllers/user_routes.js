var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'smtp.ets.lab01@gmail.com',
        pass: 'password!123'
    }
});

const jwt = require('jsonwebtoken');

///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}

module.exports = function (api, db) {
    
    //Creation d'un User
    api.post('/user/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("user creation received");
        printLog(req.body);
        var email = req.body.user.email
        var password = req.body.user.password;
        var firstname = req.body.user.firstname;
        var lastname = req.body.user.lastname;
        var role = req.body.user.role;
        var user = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            role: role
        }
        db.run("INSERT INTO User VALUES(?, ?, ?, ?, ?, ?, ?, ?)", null, firstname, lastname, email, password, role, 0, 0, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).json({ error: "A user with this email is already registered" });
            }
            else {
                if (error)
                    res.status(404).json({ "Error": error.message });
                res.json({
                    "user": {
                        "email": user.email,
                        "firstname": user.firstname,
                        "lastname": user.lastname,
                        "role": user.role
                    },
                    Message: "Utilisateur créé avec succès!"
                })
            }
        });
    });

    //Login d'un user
    api.post('/user/login', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("user login received");
        printLog(req.body);
        var sqlQuery = `SELECT Id, Firstname, Lastname, Email, Password, Role, LoginAttempts, Active FROM User WHERE Email = ?`;
        var email = req.body.user.email
        var user = {
            email: email
        }
        var params = [email];
        db.all(sqlQuery, params, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Erreur lors de l'exécution de la requête à la base de données" });
                throw error;
            }
            else {
                //Si aucun user trouvé avec ce email
                if (rows.length == 0) {
                    res.status(500).send({ error: "Invalid email or password" });
                }
                //Sinon on verifie le password du user trouvé
                else {
                    var userFound = rows[0];
                    printLog("Found: " + userFound.Email);
                    if (userFound.Active === 1) {
                        res.status(500).send({ error: "Votre compte a été désactivé, veuillez contacter votre administrateur" });
                    }
                    else {
                        if (userFound.Password === req.body.user.password) {
                            
                            //Password valide mais compte vérouillé
                            if (userFound.LoginAttempts >= 3) {
                                res.status(500).send({ error: 'Votre compte a été verouillé suite à la suite de 3 mauvaises tentatives de connexions consécutives, veuillez vérifier vos courriels pour le dévérouiller' })
                            } else {
                                //Password valide
                                var query = `UPDATE User SET LoginAttempts = 0 WHERE Email = ?`;
                                var parameters = [email];
                                db.all(query, parameters, (error, rows) => {
                                })
                                jwt.sign({ user }, 'secretkey', { expiresIn: '300s' }, (error, token) => {
                                    res.status(200).json({
                                        "user": {
                                            "email": userFound.Email,
                                            "token": token,
                                            "firstname": userFound.Firstname,
                                            "lastname": userFound.Lastname,
                                            "role": userFound.Role
                                        }
                                    })
                                })
                            }
                        } else {
                            //Password invalide
                            var queryUpdate = `UPDATE User SET LoginAttempts = ? WHERE Email = ?`;
                            var queryBadLoginInsert = `INSERT INTO BadLoginAttempts VALUES (?, ?, ?)`;
                            var loginAttempts = userFound.LoginAttempts + 1;
                            var updateParameters = [loginAttempts, email];
                            var insertParameters = [null, userFound.Email, Date.now()];
                            db.all(queryBadLoginInsert, insertParameters, (error, rows) => {
                                printLog("Inserted bad login attempt");
                            })
                            db.all(queryUpdate, updateParameters, (error, rows) => {
                                if (loginAttempts >= 3) {
                                    var mailOptions = {
                                        from: 'smtp.ets.lab01@gmail.com',
                                        to: email,
                                        subject: 'Password recovery',
                                        text: 'Your password is: ' + userFound.Password + ', unlock your account by clicking this link: http://localhost:4000/user/unlock/' + userFound.Email
                                    };
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            printLog(error);
                                        } else {
                                            printLog('Email sent: ' + info.response);
                                        }
                                    });
                                    res.status(500).send({ error: "You tried to login too many times with an incorrect password, please check your email to reset your password" });
                                } else
                                    res.status(500).send({ error: "Invalid email or password"});
                            })
                        }
                    }
                }
            }
        });
    });

    //Get le current User
    api.get('/user', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        var token = req.headers.authorization.substring(6, req.headers.authorization.length - 1);
        
        //on decode le token d'authorization et on renvoit les informations du user si valide
        var credentials = jwt.decode(token);
        if (credentials != null) {
            printLog("GET REQUEST FOR: " + credentials.user.email);
            
            //Query vers la bd pour s'assurer que les infos de l'utilisateur sont bien à jour
            var sqlQuery = `SELECT Id, Firstname, Lastname, Email, Password, Role FROM User WHERE Email = ?`;
            var params = [credentials.user.email];
            db.all(sqlQuery, params, (error, rows) => {
                if (error) {
                    res.status(500).send({ error: "Error" });
                    throw error;
                }
                else {
                    //Si aucun user trouvé avec le Email
                    if (rows.length == 0)
                        res.status(500).send({ error: "Aucun utilisateur trouvé" });
                    
                    //Sinon en renvoit les informations du user trouvé
                    else {
                        var userFound = rows[0];
                        printLog("Found: " + userFound.Email);
                        res.status(200).json({
                            "user": {
                                "id": userFound.Id,
                                "email": userFound.Email,
                                "token": token,
                                "firstname": userFound.Firstname,
                                "lastname": userFound.Lastname,
                                "role": userFound.Role
                            }
                        })
                    }
                }
            });
        } else {
            res.status(500).send({ error: "Error reading token" });
        }
    });

    //Get tous les User
    api.get('/users', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("GET REQUEST FOR ALL USERS");
        var sqlQuery = `SELECT Id, Firstname, Lastname, Email, Password, Role FROM User WHERE Id > ?`;
        var param = 0;
        db.all(sqlQuery, param, (error, rows) => {
            printLog(rows);
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun user trouvé avec la combinaison Email/Password
                if (rows.length == 0)
                    res.status(500).send({ error: "No users found" });
                //Sinon en renvoit les informations du user trouvé
                else {
                    res.json({
                        rows
                    })
                }
            }
        });
    });

    //Modification d'un User
    api.put('/user/update', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog(req.body);
        printLog("UPDATE REQUEST FOR USER WITH ID: " + req.body.user.id);
        var params = [req.body.user.email, req.body.user.firstname, req.body.user.lastname, req.body.user.password, req.body.user.role, req.body.user.id];
        db.all("UPDATE User SET Email = ?, Firstname = ?, Lastname = ?, Password = ?, Role = ? WHERE Id = ?", params, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.status(200).json({
                    "user": {
                        "id": params[5],
                        "email": params[0],
                        "firstname": params[1],
                        "lastname": params[2],
                        "role": params[4],
                        "password": params[3]
                    },
                    Message: "Utilisateur modifié avec succès!"
                })
            }
            res.end();
        });
    });

    //Desactiver un User
    api.put('/user/deactivate', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("DEACTIVATION REQUEST FOR: " + req.body.email);
        db.all("UPDATE User SET Active = ? WHERE Email = ?", 1, req.body.email, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.status(200).json({
                    Message: "Deactivation succeed"
                })
            }
        });
    });

    //Reactiver un User
    api.put('/user/reactivate', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("REACTIVATION REQUEST FOR: " + req.body.email);
        db.all("UPDATE User SET Active = ? WHERE Email = ?", 0, req.body.email, function (error, row) {
            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.status(200).json({
                    Message: "Reactivation succeed"
                })
            }
        });
    });

    //Get un User en particulier par son email
    api.get('/user/:email', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        var sqlQuery = `SELECT Id, Firstname, Lastname, Email, Password, Role, Active FROM User WHERE Email = ?`;
        var param = req.params.email;
        printLog("GET REQUEST FOR: " + req.params.email);
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun user trouvé avec le combinaison email
                if (rows.length == 0)
                    res.status(200).send({ error: "Aucun utilisateur trouvé" });
                //Sinon en renvoit les informations du user trouvé
                else {
                    var userFound = rows[0];
                    printLog("Found: " + userFound.Email);
                    res.json({
                        "user": {
                            "id": userFound.Id,
                            "email": userFound.Email,
                            "firstname": userFound.Firstname,
                            "lastname": userFound.Lastname,
                            "role": userFound.Role,
                            "active": userFound.Active
                        },
                        Message: "Utilisateur trouvé"
                    })
                }
            }
        });
    });

    api.get('/user/unlock/:email', (req, res) => {
        var sqlQuery = `UPDATE User SET LoginAttempts = 0 WHERE Email = ?`;
        var param = req.params.email;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                printLog(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.json({
                    Message: "Account unlocked successfully"
                })
            }
            res.end();
        });
    })

    //Delete un User par son id
    api.delete('/user/delete/:id', (req, res) => {
        var sqlQuery = `DELETE FROM User WHERE id = ?`;
        var param = req.params.id;
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: error });
            }
            else {
                res.status(200).send({ Message: "Delete success!" });
            }
        });
    });

    //Vide la table des users, utilisés pour les tests
    api.delete("/user/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM User", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            } else {
                res.status(200).send({ Message: "User table cleared" });
            }
        })
    })
};