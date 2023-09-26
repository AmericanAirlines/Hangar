import { Router } from 'express';
import { put } from './put';

export const members = Router();

members.post('', put);
