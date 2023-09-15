import { Router } from 'express';
import { post } from './post';

export const judge = Router();

judge.post('', post);
