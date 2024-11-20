const fs = require("fs");
const multer = require("multer");
const express = require("express");
const path = require("path");
const { uploadPdfToOCR, getExtractedText } = require("../controllers/UploadController");

const router = express.Router();

// Ensure the uploads directory exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  console.log("Creating uploads directory:", uploadPath);
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving file to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const savedFilename = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    console.log("Generated file name:", savedFilename);
    cb(null, savedFilename);
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Upload endpoint
router.post("/extract-text", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File saved successfully:", req.file);
    const filePath = path.join(uploadPath, req.file.filename);

    // Step 1: Upload the PDF to the Handwriting OCR API
    console.log("Uploading PDF to OCR API...");
    const documentId = await uploadPdfToOCR(filePath);
    console.log("Uploaded PDF, Document ID:", documentId);

    // Step 2: Retrieve extracted text from OCR API
    console.log("Fetching extracted text...");
    const extractedText = await getExtractedText(documentId);

    // Step 3: Send the extracted text as a response
    res.status(200).json({ text: extractedText });
    console.log("Extraction complete. Response sent.");
  } catch (error) {
    console.error("Error during file upload or processing:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

module.exports = router;
