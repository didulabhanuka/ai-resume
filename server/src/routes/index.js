const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/screener', require('./screener.routes'));
router.use('/cover-letter', require('./coverLetter.routes'));
router.use('/history', require('./history.routes'));

module.exports = router;