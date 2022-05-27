const db = require("../models");
const Classe = db.classe;
const GroupeCours = db.groupeCours;
const Op = db.Sequelize.Op;

exports.createMany = (req, res) => {

    let datas = [];
    let filieres = [];
    let niveaux = [];

    req.body.forEach((element) =>{
        datas.push(element);
        filieres.push(element.filiereId);
        niveaux.push(element.niveauId);
    });

    datas.forEach(element => {
        delete element.id;
    });

    let allElementsAreValid = true;
    let nonValidClasseCode = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].code || !datas[i].niveauId || !datas[i].filiereId)
        {
            allElementsAreValid = false;
            nonValidClasseCode = datas[i].code;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        Classe.bulkCreate(datas)
        .then(() =>{
            return Classe.findAll({
                where : {
                    filiereId:{
                        [Op.in]: filieres
                    },
                    niveauId:{
                        [Op.in]: niveaux
                    },
            }});
        })
        .then(classes => {
            res.status(201).send(classes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des classes."
            });
        });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le code, le niveau et la filiere de la classe ("+nonValidClasseCode+") sont requis !"
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

exports.updateOne = (req, res) => {
    const id = req.params.id;

    Classe.update({...req.body}, {
        where:{id: id}
    })
        .then(num =>{
            if(req.body.est_divisee && req.body.est_divisee === 1)
            {
                GroupeCours.destroy({where: {classeId: id}});
            }
            res.send({
                message: "Le classe a bien été modifiée !"
            });
        })
        .catch(err =>{
            res.status(500).send({
                message: "Une erreur s'est produite lors de la modification de la classe avec id = "+id
            })
        })
};
