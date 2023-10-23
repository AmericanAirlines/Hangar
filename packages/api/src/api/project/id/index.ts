import { Router } from 'express';
import { get } from './get';

export const id = Router({ mergeParams: true });

id.get('', get);
