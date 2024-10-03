const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const loginRoute = require('./routes/LoginRouter'); 
const signupRoute = require('./routes/SignUpRouter'); 
require('dotenv').config(); 

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 

// Routes
app.use('/api/login', loginRoute); 
app.use('/api/signup', signupRoute); 

// MongoDB Connection (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const PORT = process.env.PORT || 8080; // Provide default port 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
