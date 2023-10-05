import { Router } from 'express';
import { get } from './get';

export const resume = Router();

resume.get('', get);
