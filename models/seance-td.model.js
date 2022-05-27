module.exports = (sequelize, Sequelize) => {
    const SeanceTd = sequelize.define("seances_td", {
        nom: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        date: {
            type: Sequelize.DATE,
        }
    });

    return SeanceTd;
};