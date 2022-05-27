const db = require("../models");
const Ue = db.ue;
const Op = db.Sequelize.Op;

exports.createMany = (req, res) => {

    let datas = [];
    let classes = [];

    req.body.forEach((element) =>{
        datas.push(element);
        classes.push(element.classeId);
    });

    datas.forEach(element => {
        delete element.id;
    });

    let allElementsAreValid = true;
    let nonValidUeCode = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].code || !datas[i].classeId)
        {
            allElementsAreValid = false;
            nonValidUeCode = datas[i]?.code;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        Ue.bulkCreate(datas)
        .then(() =>{
            return Ue.findAll({
                where : {
                    classeId:{
                        [Op.in]: classes
                    }
            }});
        })
        .then(ues => {
            res.status(201).send(ues);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des unités d'enseignement."
            });
        });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le code et la classe de l'unité d'enseignement ("+nonValidUeCode+") sont requis !"
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
