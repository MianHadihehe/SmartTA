const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    assignmentNumber: {
        type: Number,
        required: true
    },
    modelSolution: {
        type: String,
        required: true
    },
    questionPaper: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
