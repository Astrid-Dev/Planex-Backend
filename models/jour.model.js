module.exports = (sequelize, Sequelize) => {
    const Jour = sequelize.define("jour", {
        intitule: {
            type: Sequelize.STRING,
        },
        intitule_en: {
            type: Sequelize.STRING,
        },
        numero: {
            type: Sequelize.INTEGER
        }
    });

    return Jour;
};