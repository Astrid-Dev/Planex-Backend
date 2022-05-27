const db = require("../models");
const Jour = db.jour;
//const Op = db.Sequelize.Op;


exports.findAll = (req, res) => {
    Jour.findAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la récupération des jours."
            });
        })
};

