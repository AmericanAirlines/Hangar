import { Config } from '@hangar/shared';
import { Router } from 'express';
import { slack } from './slack';
import { pingfed } from './pingfed';

export const callback = Router();

// Register the appropriate callback route based on the auth method
const { method: authMethod } = Config.Auth;
if (authMethod === 'slack') {
  callback.use('/slack', slack);
} else if (authMethod === 'pingfed') {
  callback.use('/pingfed', pingfed);
}
