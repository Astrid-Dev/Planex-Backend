const db = require("../models");
const RepartitionCours = db.repartitionCours;
const Op = db.Sequelize.Op;

exports.createMany = (req, res) => {

    let datas = [];
    let ues = [];

    req.body.forEach((element) =>{
        datas.push(element);
        ues.push(element.ueId);
    });

    datas.forEach(element => {
        delete element.id;
    });

    let allElementsAreValid = true;

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].ueId || !datas[i].enseignant1Id || !datas[i].anneeScolaireId)
        {
            allElementsAreValid = false;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        RepartitionCours.bulkCreate(datas)
            .then(() =>{
                return RepartitionCours.findAll({
                    where : {
                        ueId:{
                            [Op.in]: ues
                        },
                        anneeScolaireId: datas[0].anneeScolaireId
                    }});
            })
            .then(repartitions => {
                res.status(201).send(repartitions);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de la création des repartitions de cours."
                });
            });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "champs requis !"
            });
        }
        if(datas.length === 0){
            res.status(400).send({
                message: "Le corps de la requête est vide !"
            });
        }

        return;
    }

};