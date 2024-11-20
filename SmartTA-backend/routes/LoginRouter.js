const express = require("express");
const { login } = require("../controllers/LoginController"); // Use require for CommonJS

const router = express.Router();

router.post("/", login);

module.exports = router; // Use module.exports for CommonJS
