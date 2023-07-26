/* istanbul ignore file */
import express, { Handler } from 'express';
import rateLimit from 'express-rate-limit';

const maxFileSizeInMbs = 20;
export const enforceMaxFileSize = express.text({ limit: `${maxFileSizeInMbs}mb` });

/**
 * Allows 20 requests per minute to /api routes, only when `NODE_ENV` is `development`.
 * Cloudflare rate limits stage & prod before it hits the app
 */
export const enforceRateLimiting: Handler = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  // Return rate limit info in `RateLimit-*` headers
  standardHeaders: true,
  // Return rate limit info in `X-RateLimit-*` headers
  legacyHeaders: false,
});

export const customParsingSettings: Handler = (req, res, next) => {
  if (req.headers['stripe-signature']) {
    // Path requires raw body; do avoid other parsing
    express.raw({ type: 'application/json' })(req, res, next);
    return;
  }
  // All other requests; parse body
  express.json()(req, res, next);
};
