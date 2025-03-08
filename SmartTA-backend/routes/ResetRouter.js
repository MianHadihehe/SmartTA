const express = require("express");
const router = express.Router();
const resetController = require("../controllers/ResetController");

// Route to request a password reset
router.post("/password-reset", resetController.requestPasswordReset);

// Route to reset the password
router.post("/reset-password", resetController.resetPassword);

module.exports = router;
