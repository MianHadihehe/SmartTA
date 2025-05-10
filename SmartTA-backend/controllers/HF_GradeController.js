// src/gradeWithHF.js
const axios = require("axios");
require("dotenv").config();

const HF_API_URL = "https://api-inference.huggingface.co/models/hadimian/Smart-TA-8bit";
const HF_TOKEN = process.env.HF_TOKEN || process.env.HF_API_KEY;
if (!HF_TOKEN) {
  console.error("ERROR: Missing Hugging Face token in HF_TOKEN or HF_API_KEY");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${HF_TOKEN}`,
  "Content-Type": "application/json"
};

/**
 * Trigger the model to load in the background.
 * Using wait_for_model: false returns quickly (often 503),
 * but causes HF to spin up the model instance.
 */
async function warmModel() {
  console.log("INFO: Sending background warm-up request");
  try {
    await axios.post(
      HF_API_URL,
      { inputs: " ", options: { wait_for_model: false } },
      { headers, timeout: 10_000 }
    );
  } catch (err) {
    if (err.response?.status === 503) {
      console.log("INFO: Warm-up enqueued (503 received)");
    } else {
      console.warn("WARN: Warm-up request error:", err.message);
    }
  }
}

warmModel();  // fire-and-forget at startup

/**
 * Grade text with up to 3 retries on HF loading errors (503/504 or data.error).
 * Now logs the full response on each failure.
 */
async function gradeTextWithHF(ocrText, questions, solution) {
  const prompt = `
You are a teaching assistant responsible for grading student assignments.
Grade according to the questions and model solution, then give marks and feedback.

Questions: ${questions}
Model Solution: ${solution}
Student Response: ${ocrText}

Return your output as:
Marks: <number>;
Feedback: <text>
`;

  const payload = {
    inputs: prompt,
    options: { wait_for_model: true }
  };

  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const resp = await axios.post(HF_API_URL, payload, {
        headers,
        timeout: 300_000  // 5 minutes
      });
      const data = resp.data;
      console.log(`DEBUG [Attempt ${attempt}] HF returned:`, JSON.stringify(data, null, 2));

      // Detect HF error payloads
      const hfError = data.error || (Array.isArray(data) && data[0]?.error);
      if (hfError) {
        throw { isHFError: true, status: 503, message: hfError };
      }

      // Extract generated_text
      let generated = "";
      if (Array.isArray(data) && data[0]?.generated_text) {
        generated = data[0].generated_text;
      } else if (data.generated_text) {
        generated = data.generated_text;
      }

      if (!generated.trim()) {
        throw new Error("Empty generation");
      }

      return generated.trim();
    } catch (err) {
      const status = err.status || err.response?.status;
      const data = err.response?.data;
      const isHFError = err.isHFError;

      console.error(
        `ERROR [Attempt ${attempt}] status=${status}, data=`,
        data || err.message
      );

      // Retry on HF-loading signals or gateway timeouts
      if ((status === 503 || status === 504 || isHFError) && attempt < 6) {
        console.warn(`WARN: Retrying in 10s…`);
        await new Promise((r) => setTimeout(r, 10_000));
        continue;
      }

      // Final failure: preserve and throw the original err so you get full HTTP info
      console.error("ERROR: Final failure in grading:", err);
      throw err;
    }
  }
}

/**
 * Public entry point for grading.
 */
async function gradeOCRText(ocrText, questions, solution) {
  if (!ocrText) {
    throw new Error("OCR text is empty.");
  }
  return gradeTextWithHF(ocrText, questions, solution);
}

module.exports = { gradeTextWithHF, gradeOCRText };
