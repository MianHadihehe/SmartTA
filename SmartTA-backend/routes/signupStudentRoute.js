const express = require("express");
const { register } = require("../controllers/SignUpStudentController.js"); // Use require for CommonJS

const router = express.Router();

router.post("/", register);

module.exports = router; // Use module.exports for CommonJS
