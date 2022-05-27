const express = require("express");

const router = express.Router();

const tdCtrl = require("../controllers/td.controller");

router.post('/', tdCtrl.createMany);

module.exports = router;