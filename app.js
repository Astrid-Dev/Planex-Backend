const express = require('express');

const bodyParser = require("body-parser");

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.json());

const enseignantsRoutes = require("./routes/enseignant.routes");
const sallesRoutes = require("./routes/salle.routes");
const classesRoutes = require("./routes/classe.routes");
const niveauxRoutes = require("./routes/niveau.routes");
const joursRoutes = require("./routes/jour.routes");
const filieresRoutes = require("./routes/filiere.routes");
const facultesRoutes = require("./routes/faculte.routes");
const typesHoraireRoutes = require("./routes/type-horaire.routes");
const etudiantsRoutes = require("./routes/etudiant.routes");
const uesRoutes = require("./routes/ue.routes");
const tdsRoutes = require("./routes/td.routes");
const groupesCoursRoutes = require("./routes/groupe-cours.routes");
const planningCoursRoutes = require("./routes/planning-cours-td.routes");
const authRoutes = require("./routes/auth.routes");
const domainesRoutes = require("./routes/domaine.routes");
const domainesEnsRoutes = require("./routes/domaines-enseignant.routes");
const departementsRoutes = require("./routes/departement.routes");
const repartitionCoursRoutes = require("./routes/repartition-cours.routes");

    // const db = require("./models/index");
    //
    // db.sequelize.sync({ force: true }).then(() => {
    //     db.anneeScolaire.bulkCreate([
    //         {debut: "2021", fin: "2022"},
    //         {debut: "2022", fin: "2023"},
    //         {debut: "2023", fin: "2024"},
    //         {debut: "2024", fin: "2025"},
    //         {debut: "2025", fin: "2026"},
    //         {debut: "2026", fin: "2027"},
    //         {debut: "2027", fin: "2028"},
    //         {debut: "2028", fin: "2029"},
    //         {debut: "2029", fin: "2030"}
    //     ]).then(
    //         () =>{
    //             db.faculte.bulkCreate([
    //                 {
    //                     nom: "Faculté des Sciences",
    //                     nom_en: "Faculty of Science",
    //                     universite: "Université de Yaoundé I",
    //                     universite_en: "University of Yaounde I",
    //                     service_programmation: "Division de la Programmation et du suivi des Activités Académiques",
    //                     service_programmation_en: "Division of Programming and academic activities follow up",
    //                     semestre: 1,
    //                     anneeScolaireId: 1
    //                 }
    //             ]).then();
    //         }
    //     );
    //
    //     db.jour.bulkCreate([
    //         {intitule: "Lundi", intitule_en: "Monday", numero: 1},
    //         {intitule: "Mardi", intitule_en: "Tuesday", numero: 2},
    //         {intitule: "Mercredi", intitule_en: "Wednesday", numero: 3},
    //         {intitule: "Jeudi", intitule_en: "Thursday", numero: 4},
    //         {intitule: "Vendredi", intitule_en: "Friday", numero: 5},
    //         {intitule: "Samedi", intitule_en: "Saturday", numero: 6},
    //         {intitule: "Dimanche", intitule_en: "Sunday", numero: 0},
    //     ]).then();
    //
    //     // db.typeHoraire.bulkCreate([
    //     //     {id: 1, pause: 10},
    //     //     {id: 2, pause: 15}
    //     // ]).then(() =>{
    //     //     db.periode.bulkCreate([
    //     //         {debut: "07h00", debut_en: "07:00 AM", fin_en: "09:55 AM", fin: "09h55", typeHoraireId: 1},
    //     //         {debut: "10h05", debut_en: "10:05 AM", fin_en: "12:55 AM", fin: "12h55", typeHoraireId: 1},
    //     //         {debut: "13h05", debut_en: "01:05 PM", fin_en: "03:55 PM", fin: "15h55", typeHoraireId: 1},
    //     //         {debut: "16h05", debut_en: "04:05 PM", fin_en: "06:55 PM", fin: "18h55", typeHoraireId: 1},
    //     //         {debut: "19h05", debut_en: "07:05 PM", fin_en: "09:55 PM", fin: "21h55", typeHoraireId: 1},
    //     //         {debut: "07h30", debut_en: "07:30 AM", fin_en: "09:30 AM", fin: "09h30", typeHoraireId: 2},
    //     //         {debut: "09h45", debut_en: "09:45 AM", fin_en: "11:45 AM", fin: "11h45", typeHoraireId: 2},
    //     //         {debut: "12h00", debut_en: "12:00 AM", fin_en: "02:00 PM", fin: "14h00", typeHoraireId: 2},
    //     //         {debut: "14h15", debut_en: "02:15 PM", fin_en: "04:15 PM", fin: "16h15", typeHoraireId: 2}
    //     //     ])
    //     //         .then(() =>{
    //     //         })
    //     // })
    //     console.log("Drop and re-sync db.");
    // });

app.use("/api/enseignants", enseignantsRoutes);
app.use("/api/salles", sallesRoutes);
app.use("/api/ues", uesRoutes);
app.use("/api/etudiants", etudiantsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/filieres", filieresRoutes);
app.use("/api/niveaux", niveauxRoutes);
app.use("/api/jours", joursRoutes);
app.use("/api/facultes", facultesRoutes);
app.use("/api/tds", tdsRoutes);
app.use("/api/typesHoraires", typesHoraireRoutes);
app.use("/api/groupesCours", groupesCoursRoutes);
app.use("/api/planningCoursEtTds", planningCoursRoutes);
app.use("/api/domaines", domainesRoutes);
app.use("/api/domainesEnseignants", domainesEnsRoutes);
app.use("/api/departements", departementsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/repartitionCours", repartitionCoursRoutes);

module.exports = app;