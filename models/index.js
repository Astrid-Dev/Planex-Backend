const dbConfig = require("../configs/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.anneeScolaire = require("./annee-scolaire.model")(sequelize, Sequelize);
db.classe = require("./classe.model")(sequelize, Sequelize);
db.enseignant = require("./enseignant.model")(sequelize, Sequelize);
db.etutiantGroupeTd = require("./etudiant-groupe-td.model")(sequelize, Sequelize);
db.etudiant = require("./etudiant.model")(sequelize, Sequelize);
db.faculte = require("./faculte.model")(sequelize, Sequelize);
db.ficheSeanceTd = require("./fiche-seance-td.model")(sequelize, Sequelize);
db.filiere = require("./filiere.model")(sequelize, Sequelize);
db.groupeCours = require("./groupe-cours.model")(sequelize, Sequelize);
db.groupeTd = require("./groupe-td.model")(sequelize, Sequelize);
db.jour = require("./jour.model")(sequelize, Sequelize);
db.niveau = require("./niveau.model")(sequelize, Sequelize);
db.periode = require("./periode.model")(sequelize, Sequelize);
db.planningCoursTd = require("./planning-cours-td.model")(sequelize, Sequelize);
db.salle = require("./salle.model")(sequelize, Sequelize);
db.seanceTd = require("./seance-td.model")(sequelize, Sequelize);
db.td = require("./td.model")(sequelize, Sequelize);
db.typeHoraire = require("./type-horaire.model")(sequelize, Sequelize);
db.ue = require("./ue.model")(sequelize, Sequelize);


db.typeHoraire.hasMany(db.periode, {as: "periodes", foreignKey: "typeHoraireId"});
db.periode.belongsTo(db.typeHoraire, {
    as: "typeHoraire"
});

db.typeHoraire.hasMany(db.filiere, {as: "filieres", foreignKey: "typeHoraireId"});
db.filiere.belongsTo(db.typeHoraire, {
    as: "horaire"
});

db.anneeScolaire.hasMany(db.faculte, {as: "facultes", foreignKey: "anneeScolaireId"});
db.faculte.belongsTo(db.anneeScolaire, {
    as: "anneeScolaire"
});

db.faculte.hasMany(db.filiere, {as: "filieres"});
db.filiere.belongsTo(db.faculte, {
    foreignKey: "faculteId",
    as: "faculte"
});

db.faculte.hasMany(db.salle, {as: "salles"});
db.salle.belongsTo(db.faculte, {
    foreignKey: "faculteId",
    as: "faculte"
});

db.faculte.hasMany(db.enseignant, {as: "enseignants"});
db.enseignant.belongsTo(db.faculte, {
    foreignKey: "faculteId",
    as: "faculte"
});

db.faculte.hasMany(db.niveau, {as: "niveaux"});
db.niveau.belongsTo(db.faculte, {
    foreignKey: "faculteId",
    as: "faculte"
});

db.filiere.hasMany(db.classe, {as: "classes"});
db.classe.belongsTo(db.filiere, {
    foreignKey: "filiereId",
    as: "filiere"
});

db.niveau.hasMany(db.classe, {as: "classes"});
db.classe.belongsTo(db.niveau, {
    foreignKey: "niveauId",
    as: "niveau"
});

db.classe.hasMany(db.ue, {as: "ues"});
db.ue.belongsTo(db.classe, {
    foreignKey: "classeId",
    as: "classe"
});

db.classe.hasMany(db.planningCoursTd, {as: "plannings"});
db.planningCoursTd.belongsTo(db.classe, {
    foreignKey: "classeId",
    as: "classe"
});

db.ue.hasMany(db.planningCoursTd, {as: "plannings"});
db.planningCoursTd.belongsTo(db.ue, {
    foreignKey: "ueId",
    as: "ue"
});

db.enseignant.hasMany(db.planningCoursTd, {as: "plannings", foreignKey: "enseignant1Id",});
db.planningCoursTd.belongsTo(db.enseignant, {
    as: "enseignant1"
});
db.planningCoursTd.belongsTo(db.enseignant, {
    foreignKey: "enseignant2Id",
    as: "enseignant2"
});
db.planningCoursTd.belongsTo(db.enseignant, {
    foreignKey: "enseignant3Id",
    as: "enseignant3"
});
db.planningCoursTd.belongsTo(db.enseignant, {
    foreignKey: "enseignant4Id",
    as: "enseignant4"
});

db.salle.hasMany(db.planningCoursTd, {as: "plannings"});
db.planningCoursTd.belongsTo(db.salle, {
    foreignKey: "salleId",
    as: "salle"
});

db.td.hasMany(db.planningCoursTd, {as: "plannings"});
db.planningCoursTd.belongsTo(db.td, {
    foreignKey: "tdId",
    as: "td"
});

db.groupeTd.hasMany(db.planningCoursTd, {as: "plannings",  foreignKey: "groupeTdId"});
db.planningCoursTd.belongsTo(db.groupeTd, {
    as: "groupeTd"
});

db.groupeCours.hasMany(db.planningCoursTd, {as: "plannings", foreignKey: "groupeCoursId"});
db.planningCoursTd.belongsTo(db.groupeCours, {
    as: "groupeCours"
});

db.periode.hasMany(db.planningCoursTd, {as: "plannings"});
db.planningCoursTd.belongsTo(db.periode, {
    foreignKey: "periodeId",
    as: "periode"
});

db.jour.hasMany(db.planningCoursTd, {as: "plannings"});
db.planningCoursTd.belongsTo(db.jour, {
    foreignKey: "jourId",
    as: "jour"
});

db.anneeScolaire.hasMany(db.planningCoursTd, {as: "plannings", foreignKey: "anneeScolaireId"});
db.planningCoursTd.belongsTo(db.anneeScolaire, {
    as: "anneeScolaire"
});

db.classe.hasMany(db.groupeCours, {as: "groupesCours"});
db.groupeCours.belongsTo(db.classe, {
    foreignKey: "classeId",
    as: "ue"
});

db.ue.hasOne(db.td, {foreignKey: "ueId", as: "td"});
db.td.belongsTo(db.ue, {
    as: "ue"
});

db.td.hasMany(db.groupeTd, {as: "groupesTds"});
db.groupeTd.belongsTo(db.td, {
    foreignKey: "tdId",
    as: "td"
});

db.td.hasMany(db.seanceTd, {as: "seancesTd"});
db.seanceTd.belongsTo(db.td, {
    foreignKey: "tdId",
    as: "td"
});

db.groupeTd.hasMany(db.seanceTd, {as: "seancesTd", foreignKey: "groupeTdId"});
db.seanceTd.belongsTo(db.groupeTd, {
    as: "groupeTd"
});

db.groupeTd.hasMany(db.etutiantGroupeTd, {as: "etudiants", foreignKey: "groupeTdId"});
db.etutiantGroupeTd.belongsTo(db.groupeTd, {
    as: "groupeTd"
});

db.etudiant.hasMany(db.etutiantGroupeTd, {as: "groupesTds"});
db.etutiantGroupeTd.belongsTo(db.etudiant, {
    foreignKey: "etudiantId",
    as: "etudiant"
});

db.classe.hasMany(db.etudiant, {as: "etudiants"});
db.etudiant.belongsTo(db.classe, {
    foreignKey: "classeId",
    as: "classe"
});

module.exports = db;