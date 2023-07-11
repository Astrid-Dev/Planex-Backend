const express = require("express");

const router = express.Router();

const surveillantCtrl = require("../controllers/surveillant.controller");

router.post('/', surveillantCtrl.createMany);

module.exports = router;