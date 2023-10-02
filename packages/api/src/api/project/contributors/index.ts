import { Router } from 'express';
import { put } from './put';

export const contributors = Router();

contributors.put('', put);
