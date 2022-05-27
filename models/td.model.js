module.exports = (sequelize, Sequelize) => {
    const Td = sequelize.define("td", {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        est_divise: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },

    });

    return Td;
};