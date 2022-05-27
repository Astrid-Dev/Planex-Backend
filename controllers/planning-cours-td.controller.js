const db = require("../models");
const Planning = db.planningCoursTd;

exports.findAll = (req, res) => {
    Planning.findAll()
        .then(data =>{
            res.status(200).send(data);
        })
        .catch(err =>{
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la récupération des plannings"
            });
        });
};

exports.createManyForAClassroom = (req, res) => {

    let datas = [];
    let classeId = req.params.classeId;

    req.body.forEach((element) =>{
        datas.push(element);
    });

    datas.forEach(element => {
        delete element.id;
    });

    Planning.destroy({where: {classeId: classeId}})
    .then((temp) =>{
        Planning.bulkCreate(datas)
        .then(() => {
            return Planning.findAll({where:{classeId: classeId}});
        })
        .then((plannings) => {
            res.status(201).send({plannings: plannings, message: "Les Plannings ont bien été créés !"});
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la création des plannings."
            });
        });
    })
    .catch((err) =>{
        res.status(500).send({
            message: err.message || "Une erreur s'est produite lors de la création des plannings."
        });
    })

};

exports.updateManyForAClassroom = (req, res) =>{
    let classeId = req.params.classeId;

    const updates = req.body.map((planning) => {
        const { id, createdAt, updatedAt, ...newPlanning } = planning;
        return Planning.update(newPlanning, { where: { id: id } });
      });

    Promise.all(updates)
    .then(() => {
        return Planning.findAll({where:{classeId: classeId}});
    })
    .then((plannings) => {
        res.status(201).send({plannings: plannings,  message: "Les Plannings ont bien été modifiés !"});
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Une erreur s'est produite lors de la modification des plannings."
        });
    });
}