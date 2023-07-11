const db = require("../models");
const Surveillant = db.surveillant;

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
    let nonValidSurveillantName = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].noms || !datas[i].email || !datas[i].telephone && !datas[i].faculteId)
        {
            allElementsAreValid = false;
            nonValidSurveillantName = datas[i]?.noms;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        faculteId = datas[0].faculteId;

        Surveillant.bulkCreate(datas)
            .then(() =>{
                return Surveillant.findAll({
                    where : {
                        faculteId: faculteId
                    }});
            })
            .then(surveillants => {
                res.status(201).send(surveillants);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de la création des surveillants !."
                });
            });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le nom, le numéro de téléphone, l'adresse email et la faculté du surveillant ("+nonValidSurveillantName+") sont requis !"
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
