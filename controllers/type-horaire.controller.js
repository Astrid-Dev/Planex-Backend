const db = require("../models");
const TypeHoraire = db.typeHoraire;
//const Op = db.Sequelize.Op;


exports.findAll = (req, res) => {
    TypeHoraire.findAll({include: "periodes"})
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la récupération des horaires."
            });
        })
};

