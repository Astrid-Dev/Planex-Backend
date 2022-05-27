const db = require("../models");
const GroupeCours = db.groupeCours;
const Classe = db.classe;
const Op = db.Sequelize.Op;

exports.createMany = (req, res) => {

    let datas = [];
    let classes = [];

    req.body.forEach((element) =>{
        datas.push(element);
        if(!classes.includes(element.classeId))
        {
            classes.push(element.classeId);
        }
    });

    datas.forEach(element => {
        delete element.id;
    });

    
    GroupeCours.destroy({where: {classeId: {[Op.in]: classes}}})
        .then((destr) =>{
            GroupeCours.bulkCreate(datas)
                .then(() =>{
                    return GroupeCours.findAll({
                        where : {
                            classeId:{
                                [Op.in]: classes
                            }
                        }
                    });
                })
                .then((groupesCours) => {
                    Classe.update({est_divisee: 2}, {where: {id:{ [Op.in]: classes}}})
                        .then((groupesCours) =>{
                            res.status(201).send({message: "Les groupes de cours ont bien été enregistrés", groupes_cours: groupesCours});
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || "Une erreur s'est produite lors de la création des groupes de cours."
                            });
                        });
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Une erreur s'est produite lors de la création des groupes de cours."
                    });
                });
        })
        .catch((err) =>{
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des groupes de cours."
            });
        })

};


exports.destroyAllForOneClassroom = (req, res) => {
    const classeId = req.params.classeId;

    GroupeCours.destroy({where: {classeId: classeId}})
    .then((result) =>{
        Classe.update({est_divisee: 1}, {
            where:{id: classeId}
        })
            .then(num =>{
                res.send({
                    message: "Le classe a bien été modifiée !"
                });
            })
            .catch(err =>{
                res.status(500).send({
                    message: "Une erreur s'est produite lors de la modification de la classe avec id = "+classeId
                })
            })
    })
    .catch((err) =>{
        res.status(500).send({
            message: "Une erreur s'est produite lors de la suppression des groupes de cours de la classe avec id = "+classeId
        })
    })
};