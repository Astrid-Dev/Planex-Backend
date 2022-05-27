module.exports = (sequelize, Sequelize) => {
    const AnneeScolaire = sequelize.define("annees_scolaire", {
        debut: {
            type: Sequelize.STRING,
        },
        fin: {
            type: Sequelize.STRING,
        }
    });

    return AnneeScolaire;
};