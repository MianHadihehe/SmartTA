const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define User schema
const TeacherSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

// Hash the password before saving
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip hashing if password is not modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Export the Teacher model
const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;
