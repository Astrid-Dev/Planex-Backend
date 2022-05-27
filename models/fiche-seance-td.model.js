module.exports = (sequelize, Sequelize) => {
    const FichesSeancesTd = sequelize.define("fiches_seances_td", {
        present: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        note: {
            type: Sequelize.INTEGER,
            defaultValue: null
        }
    });

    return FichesSeancesTd;
};