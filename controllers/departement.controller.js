const db = require("../models");
const Departement = db.departement;

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
    let nonValidDepartementName = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].nom  || !datas[i].nom_en || !datas[i].faculteId)
        {
            allElementsAreValid = false;
            nonValidDepartementName = datas[i]?.nom;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        faculteId = datas[0].faculteId;

        Departement.bulkCreate(datas)
            .then(() =>{
                return Departement.findAll({
                    where : {
                        faculteId: faculteId
                    }});
            })
            .then(departements => {
                res.status(201).send(departements);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de la création des départements !."
                });
            });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Les nom et la faculté du département ("+nonValidDepartementName+") sont requis !"
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
