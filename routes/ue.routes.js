const express = require("express");

const router = express.Router();

const ueCtrl = require("../controllers/ue.controller");

router.post('/', ueCtrl.createMany);

module.exports = router;