module.exports = (sequelize, Sequelize) => {
    const PlanningsCoursTd = sequelize.define("plannings_cours_td", {
        en_parallele_avec: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
    });

    return PlanningsCoursTd;
};