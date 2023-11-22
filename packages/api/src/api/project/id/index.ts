import { Router } from 'express';
import { get } from './get';
import { mountUserMiddleware } from '../../../middleware/mountUserMiddleware';
import { put } from './put';

export const id = Router({ mergeParams: true });

id.get('', get);
id.put('', mountUserMiddleware, put);
