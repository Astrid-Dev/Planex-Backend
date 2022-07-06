const db = require("../models");
const Filiere = db.filiere;

exports.createMany = (req, res) => {

    let datas = [];
    let departementId = null;

    req.body.forEach((element) =>{
        datas.push(element);
    });

    datas.forEach(element => {
        delete element.id;
    });

    let allElementsAreValid = true;
    let nonValidFiliereCode = "";

    for(let i = 0; i < datas.length; i++)
    {
        if(!datas[i].code && !datas[i].departementId)
        {
            allElementsAreValid = false;
            nonValidFiliereCode = datas[i]?.code;
            break;
        }
    }
    if(allElementsAreValid && datas.length > 0)
    {
        departementId = datas[0].departementId;

        Filiere.bulkCreate(datas)
        .then(() =>{
            return Filiere.findAll({
                where : {
                    departementId: departementId
            }});
        })
        .then(filieres => {
            res.status(201).send(filieres);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des filières !."
            });
        });
    }
    else
    {
        if(!allElementsAreValid){
            res.status(400).send({
                message: "Le code et la faculté de la filière ("+nonValidFiliereCode+") sont requis !"
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

exports.update = (req, res) => {
    const id = req.params.id;

    Filiere.update(req.body, {
        where:{id: id}
    })
        .then(results =>{
            if(results.length > 0 && results[0] > 0){
                Filiere.findByPk(id)
                .then((filiere) =>{
                    res.send({
                        filiere: filiere,
                        message: "La filière a bien été modifiée !"
                    });
                })
                .catch((err) =>{
                    res.send({
                        filiere: req.body,
                        message: "La filière a bien été modifiée !"
                    });
                });
            }
            else{
                res.status(400).send({
                    message: "Impossible de modifier la filière avec id = "+id+". Peut être le corps de la requête était vide !"
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Une erreur s'est produite lors de la modification de la filière avec id = "+id
            })
        })
};
