const db = require("../models");
const Faculte = db.faculte;
const TypeHoraire = db.typeHoraire;
const DomaineEns = db.domaineEns;
const Ue = db.ue;
const Td = db.td;
const Jour = db.jour;
const Classe = db.classe;
const Salle = db.salle;
const AnneeScolaire = db.anneeScolaire;
const Domaine = db.domaine;
const Filiere = db.filiere;
const Departement = db.departement;
const Surveillant = db.surveillant;
const RepartitionCours = db.repartitionCours;
const Op = db.Sequelize.Op;

const lettres = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

function _objectWithoutProperties(obj, keys) {
    let target = {};
    for (let i in obj) {
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

    Faculte.findByPk(id, {include: ["departements", "niveaux", "enseignants", "surveillants"]})
        .then(faculte =>{
            if(faculte){
                let liste_departements = faculte.departements.map(elt => elt.id);
                Filiere.findAll({where: {departementId: {[Op.in]: liste_departements}}})
                    .then((filieres) =>{
                        let liste_filieres = filieres.map(elt => elt.id);
                        let liste_niveaux = faculte.niveaux.map(elt => elt.id);
                        let liste_enseignants = faculte.enseignants.map(ens => ens.id);

                        donnees_fichiers = {
                            filieres: filieres.length,
                            niveaux: faculte.niveaux.length,
                            enseignants: faculte.enseignants.length,
                            departements: faculte.departements.length,
                            surveillants: faculte.surveillants.length
                        }

                        faculte = JSON.parse(JSON.stringify(faculte));

                        let {enseignants, surveillants, departements, niveaux, ...new_faculte} = faculte;

                        faculte = new_faculte;

                        result = {
                            ...result,
                            enseignants: enseignants,
                            filieres: filieres,
                            niveaux: niveaux,
                            faculte: faculte,
                            departements: departements,
                            surveillants: surveillants
                        }

                        let promises = [1, 2, 3, 4, 5, 6, 7].map((elt, index) =>{
                            if(index === 0)
                            {
                                return Jour.findAll();
                            }
                            else if(index === 1)
                            {
                                return DomaineEns.findAll({where: {enseignantId: {[Op.in]: liste_enseignants}}});
                            }
                            else if(index === 2)
                            {
                                return TypeHoraire.findAll({where: {faculteId: faculte.id},include: ["periodes"]});
                            }
                            else if(index === 3)
                            {
                                return Classe.findAll({
                                    where:{
                                        filiereId: {
                                            [Op.in]: liste_filieres
                                        },
                                        niveauId: {
                                            [Op.in]: liste_niveaux
                                        }
                                    },
                                    include: ["etudiants", "groupesCours"]
                                });
                            }
                            else if(index === 4)
                            {
                                return Salle.findAll({where: {faculteId: faculte.id}});
                            }
                            else if(index === 5)
                            {
                                return AnneeScolaire.findOne({where: {id: faculte.anneeScolaireId}});
                            }
                            else if(index === 6)
                            {
                                return Domaine.findAll({where: {faculteId: faculte.id}});
                            }
                        });

                        Promise.all(promises)
                            .then((results) =>{
                                let result_jours = results[0];
                                let result_domaines_ens = results[1];
                                let result_type_horaires = results[2];
                                let result_classes = results[3];
                                let result_salles = results[4];
                                let result_annee_scolaire = results[5];
                                let result_domaines = results[6];

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

                                donnees_fichiers = {
                                    ...donnees_fichiers,
                                    classes: result_classes.length,
                                    etudiants: nbre_etudiants,
                                    plages_horaires: result_type_horaires?.length,
                                    salles: result_salles.length,
                                    domaines: result_domaines.length
                                }

                                result = {
                                    ...result,
                                    jours: result_jours,
                                    horaires: result_type_horaires,
                                    domaines_enseignants: result_domaines_ens,
                                    salles: result_salles,
                                    annee_scolaire: result_annee_scolaire,
                                    domaines: result_domaines,
                                }

                                let classes = result_classes.map(elt => elt.id);

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
                                    groupes_cours: groupes_cours
                                }
                                console.log(result);
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
                                        }

                                        let listeUes = result_ues.map(elt => elt.id);

                                        RepartitionCours.findAll(
                                            {
                                                where:{
                                                    ueId: {
                                                        [Op.in]: listeUes
                                                    },
                                                    anneeScolaireId: faculte.anneeScolaireId
                                                }
                                            })
                                            .then((repartition_cours) =>{
                                                donnees_fichiers = {
                                                    ...donnees_fichiers,
                                                    repartition_cours: repartition_cours.length
                                                }

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
                                                            tds: new_tds,
                                                            groupes_tds: all_groupes_tds,
                                                            repartition_cours: repartition_cours,
                                                            donnees_fichiers: donnees_fichiers
                                                        }
                                                        res.status(200).json(result);

                                                    })
                                                    .catch((err4) =>{
                                                        console.error(err4);
                                                        res.status(500).send({
                                                            message: err4.message || "Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                                                        });
                                                    });
                                            })
                                            .catch((err3) =>{
                                                console.error(err3);
                                                res.status(500).send({
                                                    message: err3.message || "Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                                                });
                                            });
                                    })
                                    .catch((err2) =>{
                                        console.error(err2);
                                        res.status(500).send({
                                            message: err2.message || "Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                                        });
                                    })
                            })
                            .catch((err) =>{
                                console.error(err);
                                res.status(500).send({
                                    message: err.message || "Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                                });
                            })
                    })
                    .catch((err) =>{
                        console.error(err);
                        res.status(500).send({
                            message: err.message || "Une erreur s'est produite lors de la recherche de la faculté avec id = "+id,
                        });
                    })
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
