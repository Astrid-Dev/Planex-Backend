const express = require("express");

const router = express.Router();

const faculteCtrl = require("../controllers/faculte.controller");

router.get('/:id/withsubsdatas', faculteCtrl.findOneWithAllSubsDatas);
router.get('/:id', faculteCtrl.findOne);

module.exports = router;