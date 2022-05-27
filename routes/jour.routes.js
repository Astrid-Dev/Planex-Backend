const express = require("express");

const router = express.Router();

const jourCtrl = require("../controllers/jour.controller");

router.get('/', jourCtrl.findAll);

module.exports = router;