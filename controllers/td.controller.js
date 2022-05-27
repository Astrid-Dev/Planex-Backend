const db = require("../models");
const Td = db.td;
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
    let nonValidTdCode = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].code || !datas[i].ueId)
        {
            allElementsAreValid = false;
            nonValidTdCode = datas[i]?.code;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        Td.bulkCreate(datas)
        .then(() =>{
            return Td.findAll({
                where : {
                    ueId:{
                        [Op.in]: ues
                    }
            }});
        })
        .then(tds => {
            res.status(201).send(tds);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des tds."
            });
        });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le code et l'UE du td ("+nonValidTdCode+") sont requis !"
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
