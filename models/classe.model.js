module.exports = (sequelize, Sequelize) => {
    const Classe = sequelize.define("classe", {
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
        est_divisee: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    });

    return Classe;
};