const express = require('express');
const router = express.Router();
const imagePredictionController = require('../controllers/imagePredictionController');

router.post('/predict', imagePredictionController.predictImage);

module.exports = router;
