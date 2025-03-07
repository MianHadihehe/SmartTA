const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/AssignmentController');

router.post('/', assignmentController.saveAssignemnt);

router.get('/', assignmentController.getAssignments);

module.exports = router;
