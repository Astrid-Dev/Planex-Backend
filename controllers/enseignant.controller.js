const db = require("../models");
const bcrypt = require('bcryptjs');
const Enseignant = db.enseignant;
const PlanningCours = db.planningCoursTd;
const Td = db.td;
const Ue = db.ue;
const GroupeCours = db.groupeCours;
const GroupeTd = db.groupeTd;
const Periode = db.periode;
const Jour = db.jour;
const Salle = db.salle;
const Classe= db.classe;
const Op = db.Sequelize.Op;

const DEFAULT_PASSWORD = "123456";

exports.createMany = (req, res) => {

    let datas = [];
    let faculteId = null;

    bcrypt.hash(DEFAULT_PASSWORD, 10).then((hash) => {
        req.body.forEach((element) =>{
            let {id, ...elt} = element;
            datas.push({...elt, password: hash});
        });
    
        let allElementsAreValid = true;
        let nonValidEnseignantName = "";

        for(let i = 0; i < datas.length; i++)
        {
            if(!datas[i].noms || !datas[i].email || !datas[i].telephone && !datas[i].faculteId)
            {
                allElementsAreValid = false;
                nonValidEnseignantName = datas[i].noms;
                break;
            }
        }
        if(allElementsAreValid && datas.length > 0)
        {
            faculteId = datas[0].faculteId;

            Enseignant.bulkCreate(datas)
            .then(() =>{
                return Enseignant.findAll({
                    where : {
                        faculteId: faculteId
                }});
            })
            .then(enseignants => {
                res.status(201).send(enseignants);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de la création des enseignants !."
                });
            });
        }
        else
        {
            if(!allElementsAreValid){
                res.status(400).send({
                    message: "Le nom, le numéro de téléphone, l'adresse email et la faculté de l'enseignant ("+nonValidEnseignantName+") sont requis !"
                });
            }
            if(datas.length === 0){
                res.status(400).send({
                    message: "Le corps de la requête est vide !"
                });
            }

            return;
        }
    })
    .catch((err) =>{
        res.status(500).send({
            message: err.message || "Une erreur s'est produite lors de la création des étudiants."
        });
    });

};

exports.findOne = (req, res) =>{
    const id = req.params.id;

    Enseignant.findByPk(id, {include: ["faculte"]})
        .then((data) =>{
            let temp = JSON.parse(JSON.stringify(data));
            let {faculte, ...enseignant} = temp;
            
            PlanningCours.findAll({
                where: {
                    [Op.or]: [{enseignant1Id: id}, {enseignant2Id: id}, {enseignant3Id: id}, {enseignant4Id: id}],
                    anneeScolaireId: faculte.anneeScolaireId,
                }})
                .then((planning_cours) =>{
                    let classesList = [];
                    let enseignantsList = [];
                    let uesList = [];
                    let tdsList = [];
                    let groupeCoursList = [];
                    let groupeTdsList = [];
                    let sallesList = [];
                    let periodesList = [];

                    planning_cours.forEach((elt) =>{
                        if(elt.classeId !== null && !classesList.includes(elt.classeId))
                        {
                            classesList.push(elt.classeId);
                        }
                        
                        if(elt.enseignant1Id !== null && !enseignantsList.includes(elt.enseignant1Id))
                        {
                            enseignantsList.push(elt.enseignant1Id);
                        }
                        if(elt.enseignant2Id !== null && !enseignantsList.includes(elt.enseignant2Id))
                        {
                            enseignantsList.push(elt.enseignant2Id);
                        }
                        if(elt.enseignant3Id !== null && !enseignantsList.includes(elt.enseignant3Id))
                        {
                            enseignantsList.push(elt.enseignant3Id);
                        }
                        if(elt.enseignant4Id !== null && !enseignantsList.includes(elt.enseignant4Id))
                        {
                            enseignantsList.push(elt.enseignant4Id);
                        }
                        
                        if(elt.ueId !== null && !uesList.includes(elt.ueId))
                        {
                            uesList.push(elt.ueId);
                        }

                        if(elt.tdId !== null && !tdsList.includes(elt.tdId))
                        {
                            tdsList.push(elt.tdId);
                        }

                        if(elt.groupeCoursId !== null && !groupeCoursList.includes(elt.groupeCoursId))
                        {
                            groupeCoursList.push(elt.groupeCoursId);
                        }

                        if(elt.groupeTdId !== null && !groupesTdsList.includes(elt.groupeTdId))
                        {
                            groupeTdsList.push(elt.groupeTdId);
                        }

                        if(elt.salleId !== null && !sallesList.includes(elt.salleId))
                        {
                            sallesList.push(elt.salleId);
                        }

                        if(elt.periodeId !== null && !periodesList.includes(elt.periodeId))
                        {
                            periodesList.push(elt.periodeId);
                        }
                    });

                    let promises = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((value, index) =>{
                        if(index === 0)
                        {
                            return Classe.findAll({where: {id: {[Op.in]: classesList}}});
                        }
                        else if(index === 1)
                        {
                            return Enseignant.findAll({where: {id: {[Op.in]: enseignantsList}}});
                        }
                        else if(index === 2)
                        {
                            return Ue.findAll({where: {id: {[Op.in]: uesList}}});
                        }
                        else if(index === 3)
                        {
                            return Td.findAll({where: {id: {[Op.in]: tdsList}}});
                        }
                        else if(index === 4)
                        {
                            return GroupeCours.findAll({where: {id: {[Op.in]: groupeCoursList}}});
                        }
                        else if(index === 5)
                        {
                            return GroupeTd.findAll({where: {id: {[Op.in]: groupeTdsList}}});
                        }
                        else if(index === 6)
                        {
                            return Salle.findAll({where: {id: {[Op.in]: sallesList}}});
                        }
                        else if(index === 7)
                        {
                            return Periode.findAll({where: {id: {[Op.in]: periodesList}}});
                        }
                        else if(index === 8)
                        {
                            return Jour.findAll();
                        }
                    });

                    Promise.all(promises)
                        .then((result) =>{
                            res.status(200).send({
                                enseignant: enseignant,
                                faculte: faculte,
                                plannings: {
                                    planning_cours: planning_cours,
                                    classes: result[0],
                                    enseignants: result[1],
                                    ues: result[2],
                                    tds: result[3],
                                    groupes_cours: result[4],
                                    groupes_tds: result[5],
                                    salles: result[6],
                                    periodes: result[7],
                                    jours: result[8]
                                },

                            });
                        })
                        .catch(err3 =>{
                            res.status(500).send({
                                message: err3.message || "Une erreur s'est produite lors de la recherche de l'enseignant avec id = "+id
                            });
                        });
                })
                .catch(err2 =>{
                    res.status(500).send({
                        message: err2.message || "Une erreur s'est produite lors de la recherche de l'enseignant avec id = "+id
                    });
                });
        })
        .catch(err =>{
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la recherche de l'enseignant avec id = "+id
            });
        });

}
