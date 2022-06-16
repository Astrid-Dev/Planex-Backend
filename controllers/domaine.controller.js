const db = require("../models");
const Domaine = db.domaine;

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
    let nonValidDomaineName = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].nom || !datas[i].faculteId)
        {
            allElementsAreValid = false;
            nonValidDomaineName = datas[i]?.nom;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        faculteId = datas[0].faculteId;

        Domaine.bulkCreate(datas)
            .then(() =>{
                return Domaine.findAll({
                    where : {
                        faculteId: faculteId
                    }});
            })
            .then(domaines => {
                res.status(201).send(domaines);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de la création des domaines !."
                });
            });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le nom et la faculté du domaine ("+nonValidDomaineName+") sont requis !"
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