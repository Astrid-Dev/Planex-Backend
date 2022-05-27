const express = require("express");

const router = express.Router();

const salleCtrl = require("../controllers/salle.controller");

router.post('/', salleCtrl.createMany);

module.exports = router;