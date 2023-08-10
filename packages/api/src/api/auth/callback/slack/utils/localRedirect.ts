import { Handler } from 'express';
import { codeQueryParam } from '../get';
import { env } from '../../../../../env';
import { logger } from '../../../../../utils/logger';

const redirectedQueryParam = 'wasRedirected';
const targetHost = 'http://localhost:3000';

/**
 * A method to locally redirect an inbound callback from Slack's OAuth
 * from the reverse proxy host to localhost.
 *
 * This middelware will only execute in a development environment and
 * simply redirects to localhost so the domain associated with the request
 * is the same as the domain we'll send the client back to.
 *
 * Without this in place, cookies would only be set for the reverse-proxy
 * domain (i.e., your ngrok domain) and localhost would be unusable; this
 * keeps all client interaction within localhost.
 *
 * @params middleware args
 *
 */
export const localRedirect: Handler = (req, res, next) => {
  const { [redirectedQueryParam]: redirected } = req.query;

  if (env.nodeEnv !== 'development' || redirected) {
    // We're either not local OR have already redirected
    next();
    return;
  }

  const { [codeQueryParam]: code } = req.query;
  const query = new URLSearchParams({
    code: code as string,
    [redirectedQueryParam]: 'true',
  });

  logger.warning('⚠️ Redirecting inbound auth callback');
  res.redirect(`${targetHost}/${req.baseUrl}?${query}`);
};
