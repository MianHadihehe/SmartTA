const FormData = require("form-data"); // Import form-data
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// Handwriting OCR API Details
const HANDWRITING_OCR_BASE_URL = process.env.HANDWRITING_OCR_BASE_URL;

console.log(HANDWRITING_OCR_BASE_URL);
const HANDWRITING_OCR_AUTH_KEY = `Bearer ${process.env.HANDWRITING_OCR_API_KEY}`;

// Upload the entire PDF to Handwriting OCR API
const uploadPdfToOCR = async (filePath) => {
  try {
    // Create FormData instance
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("action", "transcribe"); // Text extraction action

    console.log("Uploading PDF to Handwriting OCR API...");
    const response = await axios.post(
      `${HANDWRITING_OCR_BASE_URL}/documents`,
      formData,
      {
        headers: {
          Authorization: HANDWRITING_OCR_AUTH_KEY,
          ...formData.getHeaders(), // Get headers from form-data
        },
      }
    );

    return response.data.document_id; // Return the document ID
  } catch (error) {
    console.error("Error uploading PDF to Handwriting OCR API:", error.message);
    throw new Error("Failed to upload PDF to Handwriting OCR API.");
  }
};

const getExtractedText = async (documentId, format = "txt", maxRetries = 10, delay = 5000) => {
  try {
    let retries = 0;

    while (retries < maxRetries) {
      console.log(`Fetching status for Document ID: ${documentId} (Attempt ${retries + 1}/${maxRetries})...`);

      // Fetch document details
      const response = await axios.get(
        `${HANDWRITING_OCR_BASE_URL}/documents/${documentId}`,
        {
          headers: {
            Authorization: HANDWRITING_OCR_AUTH_KEY,
            Accept: "application/json",
          },
        }
      );

      // Check if the document is processed
      if (response.data.status === "processed") {
        console.log("Document processed. Fetching extracted text...");

        // Construct the download URL with the specified format
        const downloadUrl = `${HANDWRITING_OCR_BASE_URL}/documents/${documentId}.${format}`;
        console.log("Constructed Download URL:", downloadUrl);

        // Download the extracted text
        const textResponse = await axios.get(downloadUrl, {
          headers: {
            Authorization: HANDWRITING_OCR_AUTH_KEY,
            Accept: "application/json", // Ensure appropriate headers are set
          },
        });

        return textResponse.data; // Return the extracted text
      }

      // If not processed, wait and retry
      retries++;
      if (retries < maxRetries) {
        console.log(`Document not processed yet. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error("Document processing timed out.");
      }
    }
  } catch (error) {
    console.error("Error retrieving extracted text:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data); // Log API response for debugging
    }
    throw new Error("Failed to retrieve extracted text.");
  }
};




// Extract text from a PDF file
// const extractTextFromPdf = async (req, res, filename) => {
//   try {
//     const filePath = path.join(__dirname, "../uploads", filename);
//     const ext = path.extname(filename).toLowerCase();

//     if (ext !== ".pdf") {
//       throw new Error("Only PDF files are supported for this method.");
//     }

//     console.log("Processing PDF file:", filePath);

//     // Upload PDF to Handwriting OCR API
//     const documentId = await uploadPdfToOCR(filePath);
//     console.log(`Uploaded PDF, Document ID: ${documentId}`);

//     // Retrieve extracted text from Handwriting OCR API
//     const extractedText = await getExtractedText(documentId);
//     console.log("Extracted text from PDF:", extractedText);

//     // Send extracted text in response
//     res.status(200).json({ text: extractedText });

//     console.log("Extraction complete. Response sent.");
//   } catch (error) {
//     console.error("Error during text extraction:", error.message);
//     res.status(500).json({ error: error.message || "An error occurred" });
//   }
// };

module.exports = {
  uploadPdfToOCR,
  getExtractedText,
  // extractTextFromPdf,
};