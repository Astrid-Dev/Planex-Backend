module.exports = (sequelize, Sequelize) => {
    const Niveau = sequelize.define("niveau", {
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

    return Niveau;
};