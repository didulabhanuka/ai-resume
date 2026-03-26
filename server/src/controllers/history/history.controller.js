const ScreenResult = require('../../models/screener/ScreenResult');
const CoverLetter = require('../../models/coverLetter/CoverLetter');

// GET /api/history/screenings
const getScreenings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [screenings, total] = await Promise.all([
      ScreenResult.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-resumeText -jobDescription'), // exclude large text fields from list view
      ScreenResult.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      status: 'success',
      total,
      page,
      pages: Math.ceil(total / limit),
      data: screenings,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/history/screenings/:id
const getScreeningById = async (req, res, next) => {
  try {
    const screening = await ScreenResult.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!screening) {
      return res.status(404).json({
        status: 'error',
        message: 'Screening result not found.',
      });
    }

    res.status(200).json({ status: 'success', data: screening });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/history/screenings/:id
const deleteScreening = async (req, res, next) => {
  try {
    const screening = await ScreenResult.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!screening) {
      return res.status(404).json({
        status: 'error',
        message: 'Screening result not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Screening deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/history/cover-letters
const getCoverLetters = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [coverLetters, total] = await Promise.all([
      CoverLetter.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-resumeText -jobDescription -generatedLetter'), // exclude large fields from list
      CoverLetter.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      status: 'success',
      total,
      page,
      pages: Math.ceil(total / limit),
      data: coverLetters,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/history/cover-letters/:id
const getCoverLetterById = async (req, res, next) => {
  try {
    const coverLetter = await CoverLetter.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!coverLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Cover letter not found.',
      });
    }

    res.status(200).json({ status: 'success', data: coverLetter });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/history/cover-letters/:id
const deleteCoverLetter = async (req, res, next) => {
  try {
    const coverLetter = await CoverLetter.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!coverLetter) {
      return res.status(404).json({
        status: 'error',
        message: 'Cover letter not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Cover letter deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getScreenings,
  getScreeningById,
  deleteScreening,
  getCoverLetters,
  getCoverLetterById,
  deleteCoverLetter,
};