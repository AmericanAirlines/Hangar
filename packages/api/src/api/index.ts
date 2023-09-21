import { Router, json } from 'express';
import cookieSession from 'cookie-session';
import { enforceRateLimiting } from './settings';
import { env } from '../env';
import { health } from './health';
import { slack } from './slack';
import { auth } from './auth';
import { project } from './project';
import { user } from './user';
import { admin } from './admin';
import { event } from './event';
import { prize } from './prize';
import { judge } from './judge';

export const api = Router();
api.use(json());

// General API route config
// api.use(enforceMaxFileSize, customParsingSettings, nocache());
if (env.nodeEnv !== 'development') api.use(enforceRateLimiting);

api.use(
  cookieSession({
    secret: env.sessionSecret,
    maxAge: 24 * 60 * 60 * 1000,
  }),
);

// UNPROTECTED ROUTES
api.use('/auth', auth);
api.use('/event', event);
api.use('/health', health);
api.use('/prize', prize);

// SELF-PROTECTED ROUTES
api.use('/admin', admin);
api.use('/project', project);
api.use('/user', user);
api.use('/judge', judge);

// INGESTED ROUTERS
api.use(slack);

// Generic catch all for bad requests
api.use((_req, res) => res.status(404).send({ error: 'API route not found' }));
