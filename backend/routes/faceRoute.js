// routes/faceRoutes.js
const express = require('express');
const multer = require('multer');
const { faceRecognition } = require('../services/faceController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// router.post('/capture-face', upload.single('image'), faceRecognition);

module.exports = router;
