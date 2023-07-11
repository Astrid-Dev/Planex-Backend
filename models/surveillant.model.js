module.exports = (sequelize, Sequelize) => {
    const Surveillant = sequelize.define("surveillant", {
        noms: {
            type: Sequelize.STRING,
        },
        telephone: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            validate:{
                isEmail: true
            }
        },
        bureau: {
            type: Sequelize.STRING,
            defaultValue: null
        }
    });

    return Surveillant;
};