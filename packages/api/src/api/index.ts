import { Router } from 'express';
import { enforceRateLimiting } from './settings';
import { env } from '../env';
import { health } from './health';
import { slack } from './slack';
import cookieSession from 'cookie-session'

export const api = Router();

// General API route config
// api.use(enforceMaxFileSize, customParsingSettings, nocache());
if (env.nodeEnv !== 'development') api.use(enforceRateLimiting);

// UNPROTECTED ROUTES
api.use('/health', health);

// SELF-PROTECTED ROUTES
api.use(slack);

api.use(cookieSession({
    name: 'session',
    // secret:env.sessionSecret
    maxAge: 24 * 60 * 60 * 1000
}))

// Generic catch all for bad requests
api.use((_req, res) => res.status(404).send({ error: 'API route not found' }));
