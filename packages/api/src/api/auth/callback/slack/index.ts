import { Router } from 'express';
import { get } from './get';

export const slack = Router();

slack.get('/', get);
