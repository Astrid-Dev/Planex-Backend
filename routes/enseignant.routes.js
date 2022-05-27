const express = require("express");

const router = express.Router();

const enseignantCtrl = require("../controllers/enseignant.controller");

router.post('/', enseignantCtrl.createMany);
router.get('/:id', enseignantCtrl.findOne);

module.exports = router;