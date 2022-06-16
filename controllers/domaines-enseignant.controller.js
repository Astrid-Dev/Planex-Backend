const db = require("../models");
const DomaineEns = db.domaineEns;

exports.createOne = (req, res) => {

    let {id, ...data} = req.body;

    if(!data.enseignantId || !data.domaineId)
    {
        res.status(400).send({
            message: "Champs requis (enseignantId, domaineId) !"
        });
    }
    else {
        DomaineEns.create(data)
            .then((domaineEns) =>{
                res.status(201).send(domaineEns);
            })
            .catch((err) =>{
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de l'enregistrement du domaine !"
                });
            })
    }

};