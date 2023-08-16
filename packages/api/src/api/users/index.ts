import { Router, Response, Request } from 'express';
import { post } from './post';
import { addUser } from '../../utils/addUser';

export const users = Router();

users.post( '', addUser, post );
