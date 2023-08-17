import { Request, Response } from 'express';
import { mountUser } from '../../src/middleware/userMiddleware';
import { mockReq, mockRes, mockNext } from './mockData';

describe('mounting user on /user', () => {
  it('adds a user to the request when a valid session is found', async () => {
    // setup
    const req = {
      ...mockReq ,
      session: { email: 'pancakes@waffles.bananas' }
    };
    
    // test
    await mountUser(req as unknown as Request, mockRes as unknown as Response, mockNext);
    
    // assert
    expect(req.user).toBeDefined();
    expect(mockNext).toHaveBeenCalled();
  });
  
  it('sends a 403 status when a valid session is found but the user is not authorized', async () => {
    // setup
    const req = {
      ...mockReq ,
      session: { email: 'unauthorized@user.io' }
    };
    
    // test
    await mountUser(req as unknown as Request, mockRes as unknown as Response, mockNext);
    
    // assert
    expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  it('sends a 500 status when an error occurs', async () => {
    // setup
    const req = {
      ...mockReq ,
      session: { email: '' }
    };
    req.entityManager.findOne = jest.fn(() => {
      throw new Error('test error');
    });
    
    // test
    await mountUser(req as unknown as Request, mockRes as unknown as Response, mockNext);
    
    // assert
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockNext).not.toHaveBeenCalled();
  });
});