module.exports = (sequelize, Sequelize) => {
    const TypeHoraire = sequelize.define("types_horaire", {
        pause: {
            type: Sequelize.INTEGER,
        }
    });

    return TypeHoraire;
};