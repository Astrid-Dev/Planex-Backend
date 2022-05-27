const express = require("express");

const router = express.Router();

const horaireCtrl = require("../controllers/type-horaire.controller");

router.get('/', horaireCtrl.findAll);

module.exports = router;