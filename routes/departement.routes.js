const express = require("express");

const router = express.Router();

const departementCtrl = require("../controllers/departement.controller");

router.post('/', departementCtrl.createMany);

module.exports = router;