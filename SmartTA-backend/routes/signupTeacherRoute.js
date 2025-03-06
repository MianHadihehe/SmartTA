const express = require("express");
const { register } = require("../controllers/SignUpTeacherController"); // Use require for CommonJS

const router = express.Router();

router.post("/", register);

module.exports = router; // Use module.exports for CommonJS
