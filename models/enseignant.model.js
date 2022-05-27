module.exports = (sequelize, Sequelize) => {
    const Enseignant = sequelize.define("enseignant", {
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
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
            defaultValue: null
        }
    });

    Enseignant.prototype.toJSON =  function () {
        let values = Object.assign({}, this.get());

        delete values.password;
        return values;
      }

    return Enseignant;
};