const express = require("express");

const router = express.Router();

const authCtrl = require("../controllers/auth.controller");

router.post('/teacher/login', authCtrl.loginTeacher);
router.post('/student/login', authCtrl.loginStudent);

module.exports = router;