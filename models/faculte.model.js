module.exports = (sequelize, Sequelize) => {
    const Faculte = sequelize.define("faculte", {
        nom: {
            type: Sequelize.STRING,
        },
        nom_en: {
            type: Sequelize.STRING,
        },
        universite: {
            type: Sequelize.STRING,
        },
        universite_en: {
            type: Sequelize.STRING,
        },
        service_programmation: {
            type: Sequelize.STRING,
        },
        service_programmation_en: {
            type: Sequelize.STRING,
        },
        semestre: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
    });

    return Faculte;
};