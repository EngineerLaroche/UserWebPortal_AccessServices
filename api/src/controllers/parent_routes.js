///Fonction servant à print les logs à la console
///Ne print pas les log lors des tests
function printLog(log) {
    var environment = process.env.NODE_ENV
    if (environment != null && environment.localeCompare("dev ") == 0) {
        console.log(log);
    }
}

module.exports = function (api, db) {
    //Vide la table des parents, utilisés pour les tests
    api.delete("/parent/wipe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        db.all("DELETE FROM Parent", (error, rows) => {
            if (error) {
                res.status(500).send({ error: "Error" });
            }else{
                db.all("DELETE FROM LienReferentParent", (error, rows) => {
                    if (error) {
                        res.status(500).send({ error: "Error" });
                    } 
                });
                db.all("DELETE FROM RoleParentService", (error, rows) =>{
                    if (error) {
                        res.status(500).send({ error: "Error" });
                    }
                });
                res.status(200).send({Message: "done"});
            }
        });
    });

    api.get("/parents/address", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("///////Addresses GET///////");

        db.all("SELECT DISTINCT Id, Province, PostalCode, City, Street, NoCivique FROM Address", (error, rows) => {
            if (error) {
                printLog(error);
                res.status(500).send({ error: "Error" });
            }else{
                if(rows.length == 0)
                    res.status(500).send({error: "Aucune adresse trouvé"});
                else
                    res.status(200).send({Addresses: rows});
            }
        });
    })

    api.get("/parents/types", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        printLog("///////Parent types GET///////");

        db.all("SELECT * FROM ParentType WHERE Id > ?", 0, (error, rows) => {
            if (error) {
                printLog(error);
                res.status(500).send({ error: "Error" });
            }else{
                if(rows.length == 0)
                    res.status(500).send({error: "Aucun type trouvé"});
                else
                    res.status(200).send({Types: rows});
            }
        });
    })
}