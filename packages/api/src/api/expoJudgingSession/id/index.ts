import { Router } from 'express';
import { get } from './get';
import { skip } from './skip';

export const id = Router({ mergeParams: true });

id.get('', get);
id.use('/skip', skip);
