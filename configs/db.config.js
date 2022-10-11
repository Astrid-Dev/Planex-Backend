module.exports = {
    HOST: "sql.freedb.tech",
    USER: "freedb_astrid-dev",
    PASSWORD: "#Rz5eG68Mr!uVjf",
    DB: "freedb_planex",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};