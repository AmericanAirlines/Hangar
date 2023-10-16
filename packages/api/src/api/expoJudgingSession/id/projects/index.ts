import { Router } from 'express';
import { get } from './get';

export const projects = Router({ mergeParams: true });

projects.get('', get);
