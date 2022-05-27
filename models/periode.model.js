module.exports = (sequelize, Sequelize) => {
    const Periode = sequelize.define("periode", {
        debut: {
            type: Sequelize.STRING,
        },
        debut_en: {
            type: Sequelize.STRING,
        },
        fin: {
            type: Sequelize.STRING,
        },
        fin_en: {
            type: Sequelize.STRING,
        }
    });

    return Periode;
};