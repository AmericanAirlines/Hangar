import { Router } from 'express';
import { env } from '../../env';

const { gitHubClientId } = env;

export const gitHub = Router();

gitHub.get('/github/login', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${gitHubClientId}&redirect_uri=http://localhost:3000/api/auth/github/callback`;
  res.redirect(url);
});
