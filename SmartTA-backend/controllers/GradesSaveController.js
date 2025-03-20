const StudentGrade = require('../models/StudentGrade');

exports.createGrade = async (req, res) => {
  try {
    console.log("jii");
    let { rollNumber, grade, feedback, assignmentNumber } = req.body;
    rollNumber=rollNumber[0];
    // console.log(rollNumber, grade, feedback, assignmentNumber);
    const newGrade = await StudentGrade.create({
      rollNumber,
      grade,
      feedback,
      assignmentNumber
    });
    res.status(201).json(newGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getGrades = async (req, res) => {
  try {

    // console.log("in get all");
    const grades = await StudentGrade.find();
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGradesByRollNumber = async (req, res) => {
  const rollNumber = req.query.rollNumber;
  try {
    const grades = await StudentGrade.find({ rollNumber });
    res.status(200).json(grades);
  } catch (error) {
    console.error("Failed to fetch grades for roll number:", rollNumber);
    res.status(500).json({ error: "Internal server error" });
  }
};

