module.exports = (sequelize, Sequelize) => {
    const Ue = sequelize.define("ue", {
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
        est_optionnelle: {
            type: Sequelize.BOOLEAN,
        },
        semestre: {
            type: Sequelize.INTEGER,
        },
    });

    return Ue;
};