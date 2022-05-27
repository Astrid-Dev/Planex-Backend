const express = require("express");

const router = express.Router();

const planningCoursCtrl = require("../controllers/planning-cours-td.controller");

router.get('/', planningCoursCtrl.findAll);
router.post('/:classeId', planningCoursCtrl.createManyForAClassroom);
router.put('/:classeId', planningCoursCtrl.updateManyForAClassroom);

module.exports = router;