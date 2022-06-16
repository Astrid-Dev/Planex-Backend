const express = require("express");

const router = express.Router();

const domaineCtrl = require("../controllers/domaine.controller");

router.post('/', domaineCtrl.createMany);

module.exports = router;