module.exports = (sequelize, Sequelize) => {
    const Etudiant = sequelize.define("etudiant", {
        matricule: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        noms: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            validate:{
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            defaultValue: null
        }
    });

    Etudiant.prototype.toJSON =  function () {
        var values = Object.assign({}, this.get());
      
        delete values.password;
        return values;
      }

    return Etudiant;
};