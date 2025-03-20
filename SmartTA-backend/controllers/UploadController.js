const FormData = require("form-data"); // Import form-data
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const HANDWRITING_OCR_BASE_URL = process.env.HANDWRITING_OCR_BASE_URL;

const HANDWRITING_OCR_AUTH_KEY = `Bearer ${process.env.HANDWRITING_OCR_API_KEY}`;

const uploadPdfToOCR = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("action", "transcribe");

    console.log("Uploading PDF to Handwriting OCR API...");
    const response = await axios.post(
      `${HANDWRITING_OCR_BASE_URL}/documents`,
      formData,
      {
        headers: {
          Authorization: HANDWRITING_OCR_AUTH_KEY,
          ...formData.getHeaders(), 
        },
      }
    );

    return response.data.document_id;
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

      const response = await axios.get(
        `${HANDWRITING_OCR_BASE_URL}/documents/${documentId}`,
        {
          headers: {
            Authorization: HANDWRITING_OCR_AUTH_KEY,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "processed") {
        console.log("Document processed. Fetching extracted text...");

        const downloadUrl = `${HANDWRITING_OCR_BASE_URL}/documents/${documentId}.${format}`;
        console.log("Constructed Download URL:", downloadUrl);

        const textResponse = await axios.get(downloadUrl, {
          headers: {
            Authorization: HANDWRITING_OCR_AUTH_KEY,
            Accept: "application/json",
          },
        });

        return textResponse.data; 
      }

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
      console.error("Response Data:", error.response.data); 
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