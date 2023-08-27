import { Router } from 'express';
import { get } from './get';
import { localRedirect } from './utils/localRedirect';

export const slack = Router();

slack.get('', localRedirect, get);
