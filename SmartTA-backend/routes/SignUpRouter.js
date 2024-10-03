const express = require('express');
const { register } = require('../controllers/SignUpController'); 
const router = express.Router();

router.post('/', register);

module.exports = router;
