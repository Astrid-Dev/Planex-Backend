const db = require("../models");
const Faculte = db.faculte;
const TypeHoraire = db.typeHoraire;
const Ue = db.ue;
const Td = db.td;
const Jour = db.jour;
const Classe = db.classe;
const Op = db.Sequelize.Op;

const lettres = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }
    return target;
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    Faculte.findByPk(id)
        .then(data =>{
            if(data){
                res.status(200).send(data);
            }
            else{
                res.status(404).send({
                    message: "Aucune Faculté trouvée avec id = "+id,
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: err.message || "Une erreur s'est produite lors de la recherche de la faculté avec id = "+id
            });
        });
};

exports.findOneWithAllSubsDatas = (req, res) => {
    const id = req.params.id;
    let result = {};
    let donnees_fichiers = {};
    let jours = [];

    Jour.findAll()
        .then((res) =>{
            jours = res;
        });

    Faculte.findByPk(id, {include: ["filieres", "niveaux", "enseignants", "salles", "anneeScolaire"]})
        .then(faculte =>{
            if(faculte){
                result = {
                    ...result,
                    enseignants: faculte.enseignants,
                    filieres: faculte.filieres,
                    salles: faculte.salles,
                    niveaux: faculte.niveaux,
                    annee_scolaire: faculte.anneeScolaire,
                }

                let liste_filieres = [];
                let liste_niveaux = [];
                faculte.filieres.forEach((filiere) =>{
                    liste_filieres.push(filiere.id)
                });
                faculte.niveaux.forEach((niveau) =>{
                    liste_niveaux.push(niveau.id);
                });

                donnees_fichiers = {
                    filieres: faculte.filieres.length,
                    niveaux: faculte.niveaux.length,
                    enseignants: faculte.enseignants.length,
                    salles: faculte.salles.length
                }

                faculte = JSON.parse(JSON.stringify(faculte));

                let {enseignants, salles, filieres, niveaux, anneeScolaire, ...new_faculte} = faculte;

                faculte = new_faculte;

                result = {
                    ...result,
                    faculte: faculte
                }

                TypeHoraire.findAll({include: ["periodes"]})
                    .then(horaires =>{
                        const result_horaires = horaires ? horaires : [];
                        result = {
                            ...result,
                            horaires: result_horaires
                        }
                        Classe.findAll({
                                where:{
                                    filiereId: {
                                        [Op.in]: liste_filieres
                                    },
                                    niveauId: {
                                        [Op.in]: liste_niveaux
                                    }
                                },
                                include: ["etudiants", "groupesCours"]
                        })
                        .then((datas_classes) =>{
                            let result_classes = datas_classes ? datas_classes : [];
                            let etudiants = [];
                            let nbre_etudiants = 0;

                            result_classes.forEach((classe) =>{
                                nbre_etudiants += classe.etudiants.length;
                                lettres.forEach((lettre) =>{
                                    etudiants.push({
                                        lettre: lettre,
                                        nbre: classe.etudiants.filter(etudiant => etudiant.noms.startsWith(lettre)).length,
                                        classeId: classe.id
                                    });
                                });
                            });

                            // let clone_classes = [];
                            // result_classes.forEach((classe) =>{
                            //     clone_classes.push({
                            //         ...classe,
                            //         etudiants: null
                            //     })
                            // });
                            // result_classes = clone_classes;

                            donnees_fichiers = {
                                ...donnees_fichiers,
                                classes: result_classes.length,
                                etudiants: nbre_etudiants
                            }

                            let classes = [];
                            result_classes.forEach((classe) =>{
                                classes.push(classe.id);
                            });

                            const temp = JSON.parse(JSON.stringify(result_classes));
                            let new_result_classes = [];
                            let groupes_cours = [];
                            for(let classe of temp)
                            {
                                let{etudiants, groupesCours, ...new_classe} = classe;
                                groupes_cours = groupes_cours.concat(groupesCours);
                                new_result_classes.push(new_classe);
                            }

                            result = {
                                ...result,
                                classes: new_result_classes,
                                etudiants: etudiants,
                                groupes_cours: groupes_cours,
                                donnees_fichiers: donnees_fichiers
                            }

                            Ue.findAll(
                                {
                                    where:{
                                        classeId: {
                                            [Op.in]: classes
                                        },
                                        semestre : faculte.semestre
                                    }
                                })
                            .then((ues) =>{
                                const result_ues = ues ? ues : [];
                                donnees_fichiers = {
                                    ...donnees_fichiers,
                                    ues: result_ues.length
                                }
                                result = {
                                    ...result,
                                    ues: result_ues,
                                    donnees_fichiers: donnees_fichiers
                                }

                                let listeUes = [];
                                result_ues.forEach((ue) =>{
                                    listeUes.push(ue.id);
                                });

                                Td.findAll(
                                    {
                                        where:{
                                            ueId: {
                                                [Op.in]: listeUes
                                            }
                                        },
                                        include: ["groupesTds"]
                                    })
                                .then((tds) =>{
                                    let result_tds = tds ? tds : [];
                                    let all_groupes_tds = [];
                                    let new_tds = [];
                                    const temp2 = JSON.parse(JSON.stringify(result_tds));

                                    for(let td of temp2)
                                    {
                                        let{groupesTds, ...new_td} = td;
                                        new_tds.push(new_td);
                                        all_groupes_tds = all_groupes_tds.concat(groupesTds);
                                    }

                                    result = {
                                        ...result,
                                        jours: jours,
                                        tds: new_tds,
                                        groupes_tds: all_groupes_tds
                                    }
                                    res.status(200).json(result);

                                })
                                .catch((err5) =>{
                                    console.error(err5);
                                    res.status(500).send({
                                        message: err5.message || "4Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                                    });
                                });
                            })
                            .catch((err4) =>{
                                console.error(err4);
                                res.status(500).send({
                                    message: err4.message || "4Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                                });
                            })
                        })
                        .catch((err3) =>{
                            console.error(err3);
                            res.status(500).send({
                                message: err3.message || "3Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                            });
                        })
                    })
                    .catch(err2 =>{
                        console.error(err2);
                        res.status(500).send({
                            message: err2.message || "2Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                        });
                    });
            }
            else{
                res.status(404).send({
                    message: "Aucune Faculté trouvée avec id = "+id,
                });
            }
        })
        .catch(err =>{
            console.error(err);
            res.status(500).send({
                message: err.message || "1Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
            });
        });
};
