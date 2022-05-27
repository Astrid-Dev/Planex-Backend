const db = require("../models");
const Niveau = db.niveau;

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
    let nonValidNiveauCode = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].code && !datas[i].faculteId)
        {
            allElementsAreValid = false;
            nonValidNiveauCode = datas[i]?.code;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        faculteId = datas[0].faculteId;

        Niveau.bulkCreate(datas)
        .then(() =>{
            return Niveau.findAll({
                where : {
                    faculteId: faculteId
            }});
        })
        .then(niveaux => {
            res.status(201).send(niveaux);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des niveaux !."
            });
        });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le code et la faculté du niveau ("+nonValidNiveauCode+") sont requis !"
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
