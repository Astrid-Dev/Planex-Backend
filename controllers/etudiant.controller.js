const db = require("../models");
const bcrypt = require('bcryptjs');
const Etudiant = db.etudiant;
const Filiere = db.filiere;
const Niveau = db.niveau;
const Faculte = db.faculte;
const Ue = db.ue;
const Td = db.td;
const GroupeCours = db.groupeCours;
const GroupeTd = db.groupeTd;
const Enseignant = db.enseignant;
const Salle = db.salle;
const Jour = db.jour;
const Periode = db.periode;
const PlanningCours = db.planningCoursTd;
const Op = db.Sequelize.Op;

const DEFAULT_PASSWORD = "123456";

exports.createMany = (req, res) => {

    let datas = [];
    let classes = [];

    bcrypt.hash(DEFAULT_PASSWORD, 10).then((hash) => {
        req.body.forEach((element) =>{
            let {id, ...elt} = element;
            datas.push({...elt, password: hash});
            classes.push(element.classeId);
        });
    
        let allElementsAreValid = true;
        let nonValidEtudiantMatricule = "";
    
        for(let i = 0; i < datas.length; i++)
        {
            if(!datas[i].matricule || !datas[i].noms || !datas[i].classeId || !datas[i].email)
            {
                allElementsAreValid = false;
                nonValidEtudiantMatricule = datas[i].matricule;
                break;
            }
        }
        if(allElementsAreValid && datas.length > 0)
        {
            Etudiant.bulkCreate(datas)
            .then(() => {
                res.status(201).send({message: "Les étudiants ont bien été enregistrés"});
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de la création des étudiants."
                });
            });
        }
            
        else
        {
            if(!allElementsAreValid){
                res.status(400).send({
                    message: "Le matricule, le nom et l'email et la classe de l'étudiant ("+nonValidEtudiantMatricule+") sont requis !"
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

exports.findOne = (req, res) => {
    const id = req.params.id;

    Etudiant.findByPk(id, {include: ["classe"]})
        .then(data =>{
            if(data){
                const temp = JSON.parse(JSON.stringify(data));
                let {classe, ...etudiant} = temp;
                Filiere.findByPk(classe.filiereId)
                    .then((filiere) =>{
                        Niveau.findByPk(classe.niveauId)
                            .then((niveau) =>{
                                Faculte.findByPk(filiere.faculteId, {include: ["anneeScolaire"]})
                                    .then((faculte) =>{

                                        PlanningCours.findAll({
                                            where: {
                                                classeId: classe.id,
                                                anneeScolaireId: faculte.anneeScolaireId
                                            }
                                        })
                                            .then((planning_cours) =>{

                                                let uesList = [];
                                                let tdsList = [];
                                                let groupes_coursList = [];
                                                let groupes_tdsList = [];
                                                let enseignantsList = [];
                                                let sallesList = [];
                                                let periodesList = [];

                                                planning_cours.forEach((elt) =>{
                                                    if(elt.ueId !== null && !uesList.includes(elt.ueId))
                                                    {
                                                        uesList.push(elt.ueId);
                                                    }

                                                    if(elt.salleId !== null && !sallesList.includes(elt.salleId))
                                                    {
                                                        sallesList.push(elt.salleId);
                                                    }

                                                    if(elt.tdId !== null && !tdsList.includes(elt.tdId))
                                                    {
                                                        tdsList.push(elt.tdId);
                                                    }

                                                    if(elt.groupeCoursId !== null && !groupes_coursList.includes(elt.groupeCoursId))
                                                    {
                                                        groupes_coursList.push(elt.groupeCoursId);
                                                    }

                                                    if(elt.groupeTdId !== null && !groupes_tdsList.includes(elt.groupeTdId))
                                                    {
                                                        groupes_tdsList.push(elt.groupeTdId);
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

                                                    if(elt.periodeId !== null && !periodesList.includes(elt.periodeId))
                                                    {
                                                        periodesList.push(elt.periodeId);
                                                    }
                                                })

                                                let promises = [0, 1, 2, 3, 4, 5, 6, 7].map((value) =>{
                                                    if(value === 0)
                                                    {
                                                        return Jour.findAll();
                                                    }
                                                    else if(value === 1)
                                                    {
                                                        return Ue.findAll({where: {id: {[Op.in]: uesList}}});
                                                    }
                                                    else if(value === 2)
                                                    {
                                                        return Td.findAll({where: {id: {[Op.in]: tdsList}}});
                                                    }
                                                    else if(value === 3)
                                                    {
                                                        return GroupeCours.findAll({where: {id: {[Op.in]: groupes_coursList}}});
                                                    }
                                                    else if(value === 4)
                                                    {
                                                        return GroupeTd.findAll({where: {id: {[Op.in]: groupes_tdsList}}});
                                                    }
                                                    else if(value === 5)
                                                    {
                                                        return Enseignant.findAll({where: {id: {[Op.in]: enseignantsList}}});
                                                    }
                                                    else if(value === 6)
                                                    {
                                                        return Salle.findAll({where: {id: {[Op.in]: sallesList}}});
                                                    }
                                                    else if(value === 7)
                                                    {
                                                        return Periode.findAll({where: {id: {[Op.in]: periodesList}}});
                                                    }
                                                });

                                                Promise.all(promises)
                                                    .then((result) =>{
                                                        res.status(200).send({
                                                            etudiant: etudiant,
                                                            niveau: niveau,
                                                            filiere: filiere,
                                                            faculte: faculte,
                                                            classe: classe,
                                                            plannings: {
                                                                planning_cours: planning_cours,
                                                                jours: result[0],
                                                                ues: result[1],
                                                                tds: result[2],
                                                                groupes_cours: result[3],
                                                                groupes_tds: result[4],
                                                                enseignants: result[5],
                                                                salles: result[6],
                                                                periodes: result[7]
                                                            },

                                                        });
                                                    })
                                            })
                                            .catch(err5 =>{
                                                res.status(500).send({
                                                    message: err5.message || "Une erreur s'est produite lors de la recherche de l'étudiant avec id = "+id
                                                });
                                            });

                                    })
                                    .catch(err4 =>{
                                        res.status(500).send({
                                            message: err4.message || "Une erreur s'est produite lors de la recherche de l'étudiant avec id = "+id
                                        });
                                    });
                            })
                            .catch(err3 =>{
                                res.status(500).send({
                                    message: err3.message || "Une erreur s'est produite lors de la recherche de l'étudiant avec id = "+id
                                });
                            });;
                    })
                    .catch(err2 =>{
                        res.status(500).send({
                            message: err2.message || "Une erreur s'est produite lors de la recherche de l'étudiant avec id = "+id
                        });
                    });;

            }
            else{
                res.status(404).send({
                    message: "Aucun étudiant trouvé avec id = "+id,
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la recherche de l'étudiant avec id = "+id
            });
        });
};
