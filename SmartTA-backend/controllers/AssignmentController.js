const express = require('express');
const Assignment = require('../models/Assignment');


exports.saveAssignemnt = async (req, res) => {
    try {
      let { assignmentNumber, text } = req.body;
      text = text.text;
    //   console.log(rollNumber, grade, feedback, assignmentNumber);
      const newAssignemnt = await Assignment.create({
        assignmentNumber,
        text
      });
      res.status(201).json(newAssignemnt);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.getAssignments = async (req, res) => {
    try {
      const assignments = await Assignment.find();
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  