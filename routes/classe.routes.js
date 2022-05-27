const express = require("express");

const router = express.Router();

const classeCtrl = require("../controllers/classe.controller");

router.post('/', classeCtrl.createMany);
router.put("/:id", classeCtrl.updateOne);

module.exports = router;