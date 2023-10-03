import { Router } from 'express';
import { get } from './get';

export const projects = Router();

projects.get('', get);
