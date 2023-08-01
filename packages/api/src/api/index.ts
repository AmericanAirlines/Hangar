import { Router } from 'express';
import { enforceRateLimiting } from './settings';
import { env } from '../env';
import { health } from './health';
import { slack } from './slack';
import { auth } from './auth';
import { callback } from './auth/callback';

export const api = Router();

// General API route config
// api.use(enforceMaxFileSize, customParsingSettings, nocache());
if (env.nodeEnv !== 'development') api.use(enforceRateLimiting);

// UNPROTECTED ROUTES
api.use('/health', health);
api.use('/auth', auth);
api.use('/callback', callback);

// SELF-PROTECTED ROUTES
api.use(slack);

// Generic catch all for bad requests
api.use((_req, res) => res.status(404).send({ error: 'API route not found' }));
