module.exports = (sequelize, Sequelize) => {
    const GroupeCours = sequelize.define("groupes_cour", {
        nom: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lettre_debut: {
            type: Sequelize.CHAR,
        },
        lettre_fin: {
            type: Sequelize.CHAR,
        }
    });

    return GroupeCours;
};