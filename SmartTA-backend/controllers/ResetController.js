const Student = require("../models/StudentSignup");  // Import Student model
const Teacher = require("../models/TeacherSignup");  // Import Teacher model
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv"); 
dotenv.config();
// import loadingSpinner from '../assets/loading-spinner.gif'; // Add a spinner image or animation


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
      html: `<body style="margin: 0; padding: 0; width: 100%; height: 100%; background-color: black; color: white; font-family: Arial, sans-serif;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; box-sizing: border-box;">
          <div style="padding-left:5%; font-size:23px;">
              <h1 style="color: white;">Smart<span style="color: rgb(234,67,89);">TA</span></h1>
          </div>
          <div style="margin-top: 20px; font-size: 18px; line-height: 1.5; padding-left:2%;">
              Hey Mr. <span style="font-weight:bold;">${username}</span>, excited to see your progress on <strong>Smart<span style="color:rgb(234,67,89);">TA</span></strong>! We are here to support you every step of the way.
              <br><br>We just received a request from your side to update your account's password.
              <br><br>If you did not initiate it, you do not need to do anything. Otherwise, click the link below to reset your <strong>Smart<span style="color:rgb(234,67,89);">TA</span></strong> password:
              <div style="text-align: center; margin-top: 20px;">
                  <a href="http://localhost:5173/reset-password/[token]" style="color: rgb(156,53,53); font-weight:bolder; font-size:20px; text-decoration: none;">Reset Your Password</a>
              </div>
              <hr style="border: none; height: 1px; background-color: grey; margin: 20px 0;">
              <div style="font-size: 14px;">
                  <span style="color: rgb(255,45,0); font-size: 19px; font-weight: bold;">NOTE !!</span>
                  <br>
                  <span style="color: rgb(170,170,170);">Please keep your password confidential and ensure that it is not shared with anyone. This link will expire in 24 hours. If you did not request a password reset, please ignore this email.</span>
              </div>
          </div>
      </div>
  </body>`,
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


