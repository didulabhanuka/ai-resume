const express = require('express');
const router = express.Router();
const { generate, download } = require('../controllers/coverLetter/coverLetter.controller');
const { verifyToken } = require('../middleware/auth/auth.middleware');
const upload = require('../middleware/upload/upload.middleware');
const { aiLimiter } = require('../middleware/rateLimit/rateLimit.middleware');

router.post('/generate', verifyToken, aiLimiter, upload.single('resume'), generate);
router.get('/:id/download', verifyToken, download);

module.exports = router;