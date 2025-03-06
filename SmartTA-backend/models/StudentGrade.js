const mongoose = require('mongoose');

const studentGradeSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  grade: { type: String, required: true },
  feedback: { type: String, required: true },
  assignmentNumber: { type: Number, required: true }
});

const StudentGrade = mongoose.model('StudentGrade', studentGradeSchema);

module.exports = StudentGrade;
