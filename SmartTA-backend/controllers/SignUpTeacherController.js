const Teacher = require("../models/TeacherSignup"); // Use require instead of import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user with the same email already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const teacher = new Teacher({
      username,
      email,
      password: hashedPassword, // Save the hashed password
      role,
    });

    // Save the user to the database
    await teacher.save();

    // Respond with success
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register }; // Export the register function for use in routes
