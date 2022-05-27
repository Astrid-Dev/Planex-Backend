const express = require("express");

const router = express.Router();

const filiereCtrl = require("../controllers/filiere.controller");

router.post('/', filiereCtrl.createMany);
router.put('/:id', filiereCtrl.update);

module.exports = router;