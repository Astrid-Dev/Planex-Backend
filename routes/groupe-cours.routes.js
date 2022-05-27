const express = require("express");

const router = express.Router();

const groupeCoursCtrl = require("../controllers/groupe-cours.controller");

router.post('/', groupeCoursCtrl.createMany);
router.delete("/:classeId", groupeCoursCtrl.destroyAllForOneClassroom);

module.exports = router;