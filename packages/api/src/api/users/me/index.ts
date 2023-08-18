import { users } from '..';
import { validateSessionMountUser } from '../../../middleware/mountUserMiddleware';
import { returnUser } from './get';

users.get('/me', validateSessionMountUser, returnUser);
