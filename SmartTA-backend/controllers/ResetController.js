const Student = require("../models/StudentSignup");  // Import Student model
const Teacher = require("../models/TeacherSignup");  // Import Teacher model
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv"); // Import dotenv to load environment variables
dotenv.config(); // Load variables from .env file

// Controller to handle password reset request


// Controller to handle password reset request for Student and Teacher
exports.requestPasswordReset = async (req, res) => {
  console.log('Password reset request received');
  try {
    const { username } = req.body;

    // Find the user based on role: Student or Teacher
    let user;
    user = await Student.findOne({ username, role: 'student' }) || await Teacher.findOne({ username, role: 'teacher' });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Generate a secure token for resetting password
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000;  // Token expires in 1 hour

    // Store the reset token and expiration date in the appropriate model (Teacher or Student)
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();  // Save to the correct model

    // Send the reset link via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Use the email stored in .env
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).send('Password reset link sent to your email.');
  } catch (error) {
    console.error('Error in password reset request:', error);  // Log the error for better diagnosis
    res.status(500).send('Server error');
  }
};

// Controller to handle password update after reset
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    console.log("Received resetToken:", resetToken);  // Log the received reset token
    console.log("Received newPassword:", newPassword);  // Log the received new password

    // Check if a reset token and new password were sent in the request
    if (!resetToken || !newPassword) {
      return res.status(400).send("Reset token and new password are required.");
    }

    // Find the user by reset token in either Student or Teacher model
    let user;
    user = await Student.findOne({ resetToken, role: 'student' }) || await Teacher.findOne({ resetToken, role: 'teacher' });

    console.log("User found:", user);  // Check if user exists

    if (!user) {
      return res.status(400).send('Invalid or expired reset token.');
    }

    // Check if the reset token has expired
    if (user.resetTokenExpiration < Date.now()) {
      return res.status(400).send('Reset token has expired.');
    }

    // Hash the new password and save it
    user.password = newPassword;
    user.resetToken = undefined;  // Clear the reset token after use
    user.resetTokenExpiration = undefined;  // Clear expiration date
    await user.save();

    res.status(200).send('Password has been updated.');
  } catch (error) {
    console.error('Error resetting password:', error);  // Log the error for better diagnosis
    res.status(500).send('Server error');
  }
};


