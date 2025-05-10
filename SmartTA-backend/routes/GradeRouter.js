const express = require("express");
const { gradeOCRText } = require("../controllers/GradeController");
// const {gradeOCRText} = require('../controllers/HF_GradeController')

const router = express.Router();

// Route to send OCR text for grading
router.post("/grade", async (req, res) => {
  try {
    console.log("in router, body: "+req.body);
    const { data } = req.body; // Extract the OCR text from the request body
    const { questions } = req.body; // Extract the OCR text from the request body
    const { solution } = req.body; 
    // console.log(data);
    // Validate that OCR text is provided
    // if (!data || data.trim() === "") {
    //   console.error("Error: No OCR text provided in the request.");
    //   return res.status(400).json({ error: "No OCR text provided for grading" });
    // }

    console.log("Received OCR text for grading:", data);
    console.log("Received OCR text of questions:", questions);
    console.log("Received Model Solution of questions:", solution);

    // Call the controller function to process the text
    const gradedText = await gradeOCRText(data, questions, solution);

    // Check if gradedText is valid
    if (!gradedText) {
      console.error("Error: Graded text is empty or invalid.");
      return res.status(500).json({ error: "Failed to grade the provided OCR text." });
    }

    // Send the graded result as a response
    res.status(200).json({ gradedText });
    console.log("Grading complete. Graded text sent successfully.");
  } catch (error) {
    console.error("Error during grading process:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

module.exports = router;
