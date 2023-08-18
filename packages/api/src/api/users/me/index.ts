import { users } from '..';
import { mountUserMiddleware } from '../../../middleware/mountUserMiddleware';

users.get('/api/users/me', mountUserMiddleware, (req, res) => {
  res.json(req.user);
});
