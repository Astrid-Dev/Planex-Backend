module.exports = (sequelize, Sequelize) => {
    const Departement = sequelize.define("departement", {
        nom: {
            type: Sequelize.STRING,
        },
        nom_en: {
            type: Sequelize.STRING,
        }
    });

    return Departement;
};