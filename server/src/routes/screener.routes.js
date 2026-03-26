const express = require('express');
const router = express.Router();
const { screen } = require('../controllers/screener/screener.controller');
const { verifyToken } = require('../middleware/auth/auth.middleware');
const upload = require('../middleware/upload/upload.middleware');
const { aiLimiter } = require('../middleware/rateLimit/rateLimit.middleware');

router.post('/screen', verifyToken, aiLimiter, upload.single('resume'), screen);

module.exports = router;