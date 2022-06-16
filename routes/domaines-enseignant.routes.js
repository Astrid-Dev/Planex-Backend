const express = require("express");

const router = express.Router();

const domaineEnsCtrl = require("../controllers/domaines-enseignant.controller");

router.post('/', domaineEnsCtrl.createOne);

module.exports = router;