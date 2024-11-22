const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// OpenAI API Configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Send OCR-extracted text to GPT-3.5 for grading.
 * @param {string} ocrText - The text extracted from the OCR API.
 * @returns {Promise<string>} - The response text (graded result) from GPT-3.5.
 */
const gradeTextWithGPT = async (ocrText) => {
  try {
    console.log("Sending OCR text to GPT-3.5 for grading...");
    // console.log(`OCR Text Length: ${ocrText.length}`); 

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a teaching assistant responsible for grading student assignments according to the questions.",
          },
          {
            role: "user",
            content: `Please grade the following text and provide feedback:\n\n${ocrText}. Also extract the rollnumber from the text and give grade,rollnumber and feedback all separated by a semi-colon`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Received response from GPT-3.5.");

    // Ensure response contains the expected structure
    if (!response.data || !response.data.choices || !response.data.choices[0].message) {
      throw new Error("Unexpected response structure from GPT-3.5.");
    }

    return response.data.choices[0].message.content; 
  } catch (error) {
    console.error("Error sending text to GPT-3.5:", error.message);

    if (error.response) {
      console.error("OpenAI Response Error Data:", error.response.data); 
    }

    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      throw new Error("Unable to connect to GPT-3.5 API. Please check your network or API URL.");
    }

    throw new Error("Failed to get a response from GPT-3.5. Please check the API key or input text.");
  }
};

/**
 * Controller to handle grading via GPT-3.5.
 */
const gradeOCRText = async (ocrText) => {
  try {
    console.log("Grading OCR text...");

    if (!ocrText) {
      throw new Error("Provided OCR text is empty or invalid.");
    }

    // console.log("Text to grade:", ocrText.substring(0, 100)); // Log first 100 characters for debugging

    // Get graded result from GPT-3.5
    const gradedText = await gradeTextWithGPT(ocrText);

    console.log("Graded text received from GPT-3.5:", gradedText.substring(0, 100)); // Log first 100 characters
    return gradedText; // Return the graded text, but do not send a response here
  } catch (error) {
    console.error("Error grading OCR text:", error.message);
    throw new Error(error.message || "Failed to grade OCR text."); // Pass error to the router
  }
};

module.exports = {
  gradeTextWithGPT,
  gradeOCRText,
};
