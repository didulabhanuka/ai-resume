const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many auth attempts, please try again in 15 minutes.',
  },
});

// AI endpoints — 5 requests per hour per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.AI_REQUESTS_PER_HOUR) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'AI request limit reached. Please try again in an hour.',
  },
});

module.exports = { apiLimiter, authLimiter, aiLimiter };