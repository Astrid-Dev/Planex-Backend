const db = require("../models");
const AnneeScolaire = db.anneeScolaire;

exports.create = (req, res) => {

    if(!req.body.debut || !req.body.fin){
        res.status(400).send({
            message: "Champs requis (debut, fin) !"
        });
        return;
    }

    delete req.body.id;

    AnneeScolaire.create(req.body)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création de l'année scolaire !."
            });
        });

};

exports.findAll = (req, res) => {
    AnneeScolaire.findAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la récupération des années scolaires."
            });
        })
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    AnneeScolaire.findByPk(id)
        .then(data =>{
            if(data){
                res.status(200).send(data);
            }
            else{
                res.status(404).send({
                    message: "Aucune année scolaire trouvée avec id = "+id,
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Une erreur s'est produite lors de la recherche de l'année scolaire avec id = "+id
            });
        });
};
