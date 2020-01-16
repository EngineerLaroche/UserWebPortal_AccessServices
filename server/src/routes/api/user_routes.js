var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'smtp.ets.lab01@gmail.com',
        pass: 'password!123'
    }
});

const jwt = require('jsonwebtoken');

module.exports = function (api, db) {
    //Creation d'un User
    api.post('/user/create', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        console.log("user creation received");
        console.log(req.body);
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
                console.log(error);
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
                    }
                })
            }
        });
    });

    //Login d'un user
    api.post('/user/login', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        console.log("user login received");
        console.log(req.body);
        var sqlQuery = `SELECT Id, Firstname, Lastname, Email, Password, Role, LoginAttempts, Active FROM User WHERE Email = ?`;
        var email = req.body.user.email
        var user = {
            email: email
        }
        var params = [email];
        db.all(sqlQuery, params, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun user trouvé avec ce email
                if (rows.length == 0) {
                    res.status(500).send({ error: "No account registered to this email" });
                }
                //Sinon on verifie le password du user trouvé
                else {
                    var userFound = rows[0];
                    console.log("Found: " + userFound.Email);
                    if (userFound.Active === 1) {
                        res.status(500).send({ error: "Your account has been deactivated, please contact your administrator" });
                    }
                    else {
                        if (userFound.Password === req.body.user.password) {
                            //password valide
                            var query = `UPDATE User SET LoginAttempts = 0 WHERE Email = ?`;
                            var parameters = [email];
                            db.all(query, parameters, (error, rows) => {
                            })
                            jwt.sign({ user }, 'secretkey', { expiresIn: '300s' }, (error, token) => {
                                res.json({
                                    "user": {
                                        "email": userFound.Email,
                                        "token": token,
                                        "firstname": userFound.Firstname,
                                        "lastname": userFound.Lastname,
                                        "role": userFound.Role
                                    }
                                })
                            })
                        } else {
                            //password invalide
                            var queryUpdate = `UPDATE User SET LoginAttempts = ? WHERE Email = ?`;
                            var queryBadLoginInsert = `INSERT INTO BadLoginAttempts VALUES (?, ?, ?)`;
                            var loginAttempts = userFound.LoginAttempts + 1;
                            if (loginAttempts > 3) {
                                var mailOptions = {
                                    from: 'smtp.ets.lab01@gmail.com',
                                    to: email,
                                    subject: 'Password recovery',
                                    text: 'Your password is: ' + userFound.Password + ', unlock your account by clicking this link: http://localhost:4000/user/unlock/' + userFound.Email
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                                res.status(500).send({ error: "You tried to login too many times with an incorrect password, please check your email to reset your password" });
                            }
                            else {
                                var updateParameters = [loginAttempts, email];
                                var insertParameters = [null, userFound.Email, Date.now()];
                                db.all(queryBadLoginInsert, insertParameters, (error, rows) => {
                                    console.log("Inserted bad login attempt");
                                })
                                db.all(queryUpdate, updateParameters, (error, rows) => {
                                    res.status(500).send({ error: "Invalid password: Attempt #" + loginAttempts });
                                })
                            }
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
            console.log("GET REQUEST FOR: " + credentials.user.email);
            //Query vers la bd pour s'assurer que les infos de l'utilisateur sont bien à jour
            var sqlQuery = `SELECT Firstname, Lastname, Email, Password, Role FROM User WHERE Email = ?`;
            var params = [credentials.user.email];
            db.all(sqlQuery, params, (error, rows) => {
                if (error) {
                    res.status(500).send({ error: "Error" });
                    throw error;
                }
                else {
                    //Si aucun user trouvé avec la combinaison Email/Password
                    if (rows.length == 0)
                        res.status(500).send({ error: "Invalid credentials" });
                    //Sinon en renvoit les informations du user trouvé
                    else {
                        var userFound = rows[0];
                        console.log("Found: " + userFound.Email);
                        res.json({
                            "user": {
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
        } else{
            res.status(500).send({ error: "Error reading token" });
        }
    });


    //Get tous les User
    api.get('/users', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        console.log("GET REQUEST FOR ALL USERS");
        var sqlQuery = `SELECT Firstname, Lastname, Email, Password, Role FROM User WHERE Id > ?`;
        var param = 0;
        db.all(sqlQuery, param, (error, rows) => {
            console.log(rows);
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
        var token = req.headers.authorization.substring(6, req.headers.authorization.length - 1);
        var credentials = jwt.decode(token);
        console.log("UPDATE REQUEST FOR: " + credentials.user.email);
        console.log(req.body.user);
        var params = [req.body.user.firstname, req.body.user.lastname, req.body.user.email, req.body.user.password, req.body.user.role, credentials.user.email];
        db.all("UPDATE User SET Firstname = ?, Lastname = ?, Email = ?, Password = ?, Role = ? WHERE Email = ?", params, function (error, row) {
            if (error) {
                console.log(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.json({
                    "user": {
                        "email": params[2],
                        "token": token,
                        "firstname": params[0],
                        "lastname": params[1],
                        "role": params[4]
                    }
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
        //var token = req.headers.authorization.substring(6, req.headers.authorization.length - 1);
        //var credentials = jwt.decode(token);
        console.log("DEACTIVATION REQUEST FOR: " + req.body.email);
        var params = [1, req.body.email];
        db.all("UPDATE User SET Active = ? WHERE Email = ?", params, function (error, row) {
            if (error) {
                console.log(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.json({
                    message: "Deactivation succeed"
                })
            }
            res.end();
        });
    });


    //Reactiver un User
    api.put('/user/reactivate', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        //var token = req.headers.authorization.substring(6, req.headers.authorization.length - 1);
        //var credentials = jwt.decode(token);
        console.log("REACTIVATION REQUEST FOR: " + req.body.email);
        var params = [0, req.body.email];
        db.all("UPDATE User SET Active = ? WHERE Email = ?", params, function (error, row) {
            if (error) {
                console.log(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.json({
                    message: "Reactivation succeed"
                })
            }
            res.end();
        });
    });

    //Get un User en particulier par son email
    api.get('/user/:email', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        var sqlQuery = `SELECT Firstname, Lastname, Email, Password, Role, Active FROM User WHERE Email = ?`;
        var param = req.params.email;
        console.log("GET REQUEST FOR: " + req.params.email);
        db.all(sqlQuery, param, (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
                throw error;
            }
            else {
                //Si aucun user trouvé avec la combinaison Email/Password
                if (rows.length == 0)
                    res.status(500).send({ error: "Invalid credentials" });
                //Sinon en renvoit les informations du user trouvé
                else {
                    var userFound = rows[0];
                    console.log("Found: " + userFound.Email);
                    res.json({
                        "user": {
                            "email": userFound.Email,
                            "firstname": userFound.Firstname,
                            "lastname": userFound.Lastname,
                            "role": userFound.Role,
                            "active": userFound.Active
                        }
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
                console.log(error);
                res.status(500).send({ error: error.message });
            }
            else {
                res.json({
                    message: "Account unlocked successfully"
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
                throw error;
            }
            rows.forEach((row) => {
                console.log(row.Lastname);
            });
        });
    });
};