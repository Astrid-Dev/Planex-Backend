const express = require("express");

const router = express.Router();

const etudiantCtrl = require("../controllers/etudiant.controller");

router.post('/', etudiantCtrl.createMany);
router.get('/:id', etudiantCtrl.findOne);

module.exports = router;