const db = require("../models");
const Salle = db.salle;

exports.createMany = (req, res) => {

    let datas = [];
    let faculteId = null;

    req.body.forEach((element) =>{
        datas.push(element);
    });

    datas.forEach(element => {
        delete element.id;
    });

    let allElementsAreValid = true;
    let nonValidSalleCode = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].code && !datas[i].faculteId)
        {
            allElementsAreValid = false;
            nonValidSalleCode = datas[i]?.code;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        faculteId = datas[0].faculteId;

        Salle.bulkCreate(datas)
        .then(() =>{
            return Salle.findAll({
                where : {
                    faculteId: faculteId
            }});
        })
        .then(salles => {
            res.status(201).send(salles);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des salles !."
            });
        });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le code et la faculté de la salle ("+nonValidSalleCode+") sont requis !"
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
