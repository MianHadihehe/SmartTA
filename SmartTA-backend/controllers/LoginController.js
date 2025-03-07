const Teacher = require("../models/TeacherSignup"); // Use require instead of import
const Student = require("../models/StudentSignup"); // Use require instead of import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password, role } = req.body;

  console.log(email,password,role);

  try {
    if(role==='student'){
      // Find user by email
      const student = await Student.findOne({ email });
      if (!student) {
        console.log("first");
        return res.status(400).json({ message: "Student not found" });
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
        console.log("second");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send response with token and user details
      res.json({
        message: "Login successful",
        token,
        role: student.role,
        username: student.username,
        rollNumber: student.rollNumber,
      });
    }

    else if(role==='teacher'){
      const teacher = await Teacher.findOne({ email });
      if (!teacher) {
        return res.status(400).json({ message: "Teacher not found" });
      }
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, teacher.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send response with token and user details
      res.json({
        message: "Login successful",
        token,
        role: teacher.role,
        username: teacher.username,
      });
      }
    
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login }; // Export the login function for use in routes
