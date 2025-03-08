const Student = require("../models/StudentSignup");  // Import Student model
const Teacher = require("../models/TeacherSignup");  // Import Teacher model
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv"); 
dotenv.config();

exports.requestPasswordReset = async (req, res) => {
  console.log('Password reset request received');
  try {
    const { role, username } = req.body;

    console.log(role, username);
    let user;
    if(role==='student'){
      user = await Student.findOne({ username, role: 'student' })
    }
    else if(role==='teacher'){
      user = await Teacher.findOne({ username, role: 'teacher' });
    }

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000;
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();  

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

    await transporter.sendMail(mailOptions);
    res.status(200).send('Password reset link sent to your email.');
  } catch (error) {
    console.error('Error in password reset request:', error);  
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    console.log("Received resetToken:", resetToken);  
    console.log("Received newPassword:", newPassword); 

    if (!resetToken || !newPassword) {
      return res.status(400).send("Reset token and new password are required.");
    }
    let user;
    user = await Student.findOne({ resetToken, role: 'student' }) || await Teacher.findOne({ resetToken, role: 'teacher' });
    // console.log("User found:", user);

    if (!user) {
      return res.status(400).send('Invalid or expired reset token.');
    }

    if (user.resetTokenExpiration < Date.now()) {
      return res.status(400).send('Reset token has expired.');
    }
    user.password = newPassword;
    user.resetToken = undefined; 
    user.resetTokenExpiration = undefined;  
    await user.save();
    res.status(200).send('Password has been updated.');
  } catch (error) {
    console.error('Error resetting password:', error);  
    res.status(500).send('Server error');
  }
};


