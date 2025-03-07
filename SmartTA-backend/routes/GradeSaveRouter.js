const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/GradesSaveController');

// Post a new grade
router.post('/', gradesController.createGrade);

// // Get all grades
router.get('/', gradesController.getGrades);

router.get("/by-roll-number", gradesController.getGradesByRollNumber);

module.exports = router;
