const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * @param {string} ocrText - The text extracted from the OCR API.
 * @returns {Promise<string>} - The response text (graded result) from GPT-3.5.
 */

 const gradeTextWithGPT = async (ocrText, questions, solution) => {
  try {
    console.log("Sending OCR text to GPT-3.5 for grading...");

    if (typeof ocrText !== "string") {
      ocrText = JSON.stringify(ocrText);
    }

    if (typeof questions !== "string") {
      questions = JSON.stringify(questions); 
    }

    if (typeof solution !== "string") {
      solution = JSON.stringify(solution); 
    }

    // console.log("GC, OCR text of answer:", ocrText);
    // console.log("GC, OCR text of question:", questions);
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4-0613",
        messages: [
          {
            role: "system",
            content: `You are a teaching assistant responsible for grading student assignments 
            according to the questions. Your job is to give Marks and an extensive 
            feedback to the student.`,
          },
          {
            role: "user",
            content: `These are the questions to grade: ${questions}.
            Ensure you are grading on the basis of the marks given in the question paper. 
            Please grade the following student response and provide feedback and 
            total marks.\n\n${ocrText}, by comparing with model solution: ${solution} using a rubric.
            Use I and 1 in between strings as seperators(|) as they do in automata.
            Give grade as 'Marks:' and feedback as 'Feedback:', Strictly separate grade and 
            feedback with a semicolon (;)`,
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

const gradeOCRText = async (ocrText, questions) => {
  try {
    console.log("Grading OCR text...");

    if (!ocrText) {
      throw new Error("Provided OCR text is empty or invalid.");
    }
    const gradedText = await gradeTextWithGPT(ocrText, questions);

    console.log("Graded text received from GPT-4:", gradedText.substring(0, 100)); 
    return gradedText; 
  } catch (error) {
    console.error("Error grading OCR text:", error.message);
    throw new Error(error.message || "Failed to grade OCR text."); 
  }
};

module.exports = {
  gradeTextWithGPT,
  gradeOCRText,
};
