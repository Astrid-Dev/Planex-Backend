module.exports = (sequelize, Sequelize) => {
    const GroupeTd = sequelize.define("groupes_td", {
        nom: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    });

    return GroupeTd;
};