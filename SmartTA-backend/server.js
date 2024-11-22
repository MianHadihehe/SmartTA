const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv"); // For environment variables
const loginRoute = require("./routes/LoginRouter"); // No .js extension needed
const signupRoute = require("./routes/SignUpRouter"); // No .js extension needed
const uploadRoute = require("./routes/UploadRouter"); // No .js extension needed
const gradeRoute = require("./routes/GradeRouter");


dotenv.config(); // Initialize environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/login", loginRoute);
app.use("/api/signup", signupRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/grade", gradeRoute);


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 8080; // Provide default port 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
