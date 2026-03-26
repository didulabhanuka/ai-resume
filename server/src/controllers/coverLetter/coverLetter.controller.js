const CoverLetter = require('../../models/coverLetter/CoverLetter');
const { streamCoverLetter } = require('../../services/claude/claude.service');
const { extractText } = require('../../services/pdf/pdfParser.service');
const { generatePdf } = require('../../services/pdf/pdfExport.service');

// POST /api/cover-letter/generate
const generate = async (req, res, next) => {
  try {
   const { jobDescription } = req.body;
    // Parse settings — sent as JSON string in FormData
    const settings = typeof req.body.settings === 'string'
    ? JSON.parse(req.body.settings)
    : req.body.settings;
    let resumeText = req.body.resumeText;

    if (req.file) {
      resumeText = await extractText(req.file.buffer);
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Job description is required.',
      });
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Resume text or PDF is required.',
      });
    }

    const parsedSettings = {
      tone: settings?.tone || 'professional',
      length: settings?.length || 'medium',
      focus: settings?.focus || 'technical-skills',
      customNote: settings?.customNote || '',
    };

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let fullText = '';

    await streamCoverLetter(
      jobDescription,
      resumeText,
      parsedSettings,
      (chunk) => {
        fullText += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    );

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    await CoverLetter.create({
      userId: req.user._id,
      jobDescription,
      resumeText,
      generatedLetter: fullText,
      tone: parsedSettings.tone,
      length: parsedSettings.length,
      focus: parsedSettings.focus,
      customNote: parsedSettings.customNote,
      wordCount: fullText.split(' ').length,
    });
  } catch (err) {
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    } else {
      next(err);
    }
  }
};

// GET /api/cover-letter/:id/download
const download = async (req, res, next) => {
  try {
    const letter = await CoverLetter.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!letter) {
      return res.status(404).json({
        status: 'error',
        message: 'Cover letter not found.',
      });
    }

    // Generate PDF from stored letter text
    const pdfBytes = await generatePdf(letter.generatedLetter, req.user.name);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cover-letter-${letter._id}.pdf"`
    );
    res.setHeader('Content-Length', pdfBytes.length);

    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
};

module.exports = { generate, download };