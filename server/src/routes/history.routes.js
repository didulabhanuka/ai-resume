const express = require('express');
const router = express.Router();
const {
  getScreenings,
  getScreeningById,
  deleteScreening,
  getCoverLetters,
  getCoverLetterById,
  deleteCoverLetter,
} = require('../controllers/history/history.controller');
const { verifyToken } = require('../middleware/auth/auth.middleware');

// All history routes are protected
router.use(verifyToken);

// Screenings
router.get('/screenings', getScreenings);
router.get('/screenings/:id', getScreeningById);
router.delete('/screenings/:id', deleteScreening);

// Cover letters
router.get('/cover-letters', getCoverLetters);
router.get('/cover-letters/:id', getCoverLetterById);
router.delete('/cover-letters/:id', deleteCoverLetter);

module.exports = router;