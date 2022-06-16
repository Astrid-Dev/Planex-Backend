module.exports = (sequelize, Sequelize) => {
    const Domaine = sequelize.define("domaine", {
        nom: {
            type: Sequelize.STRING
        },
        nom_en: {
            type: Sequelize.STRING
        }
    });

    return Domaine;
};