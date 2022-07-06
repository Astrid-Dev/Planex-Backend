const express = require("express");

const router = express.Router();

const RepartitionCoursCtrl = require("../controllers/repartition-cours.controller");

router.post('/', RepartitionCoursCtrl.createMany);

module.exports = router;