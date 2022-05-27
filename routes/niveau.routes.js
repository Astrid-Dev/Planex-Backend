const express = require("express");

const router = express.Router();

const niveauCtrl = require("../controllers/niveau.controller");

router.post('/', niveauCtrl.createMany);

module.exports = router;