const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define Student schema (with resetToken and resetTokenExpiration)
const StudentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  resetToken: { type: String },  // Add resetToken
  resetTokenExpiration: { type: Date },  // Add resetTokenExpiration
});

// Hash the password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip hashing if password is not modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create or get the Student model
const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);

// Export models
module.exports = { Student };
