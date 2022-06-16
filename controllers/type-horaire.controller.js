const db = require("../models");
const TypeHoraire = db.typeHoraire;
const Periode = db.periode;
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


exports.createOne = (req, res) => {

    let {periodes, ...data} = req.body;
    if(!data.faculteId || !data.pause)
    {
        res.status(400).send({
            message: "Champs requis (pause, faculteId) !"
        });
    }
    else{
        TypeHoraire.create(data)
            .then((horaire) =>{
                if(periodes && periodes.length > 0)
                {
                    periodes.forEach((elt, index, temp) =>{
                        let {id, ...tmp} = elt;
                        temp[index] = {
                            ...tmp,
                            typeHoraireId: horaire.id
                        }
                    });

                    Periode.bulkCreate(periodes)
                        .then((periodesList) =>{
                            TypeHoraire.findAll({where: {faculteId: data.faculteId}, include: ["periodes"]})
                                .then((horaires) =>{
                                    res.status(201).send(horaires);
                                })
                                .catch((err2) =>{
                                    res.status(500).send({
                                        message: err2.message || "Une erreur s'est produite lors de l'enregistrement des horaires!"
                                    });
                                });
                        })
                        .catch((err) =>{
                            res.status(500).send({
                                message: err.message || "Une erreur s'est produite lors de l'enregistrement des horaires!"
                            });
                        });
                }
                else{
                    TypeHoraire.findAll({where: {faculteId: data.faculteId, include: ["periodes"]}})
                        .then((horaires) =>{
                            res.status(201).send(horaires);
                        })
                        .catch((err) =>{
                            res.status(500).send({
                                message: err.message || "Une erreur s'est produite lors de l'enregistrement des horaires!"
                            });
                        });
                }
            })
            .catch((error) =>{
                res.status(500).send({
                    message: error.message || "Une erreur s'est produite lors de l'enregistrement des horaires!"
                });
            });
    }

};
