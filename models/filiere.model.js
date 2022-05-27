module.exports = (sequelize, Sequelize) => {
    const Filiere = sequelize.define("filiere", {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        intitule: {
            type: Sequelize.STRING,
        },
        intitule_en: {
            type: Sequelize.STRING,
        }
    });

    return Filiere;
};