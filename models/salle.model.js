module.exports = (sequelize, Sequelize) => {
    const Salle = sequelize.define("salle", {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        intitule: {
            type: Sequelize.STRING,
        },
        intitule_en: {
            type: Sequelize.STRING,
        },
        capacite: {
            type: Sequelize.INTEGER,
        },
        capacite_barr: {
            type: Sequelize.INTEGER,
        },
        capacite_exam: {
            type: Sequelize.INTEGER,
        },
        etat: {
            type: Sequelize.STRING,
            defaultValue: null
        }
    });

    return Salle;
};