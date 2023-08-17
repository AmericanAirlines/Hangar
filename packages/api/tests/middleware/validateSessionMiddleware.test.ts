import { Request, Response } from 'express';
import { validateSession } from '../../src/middleware/validateSessionMiddleware';
import { mockReq, mockRes, mockNext } from './mockData';

describe('session validation', () => {
  it('calls next when a valid session is found', async () => {
    // setup
    const req = {
      ...mockReq ,
      session: { email: '' }
    };
    
    // test
    await validateSession(req as unknown as Request, mockRes as unknown as Response, mockNext);
    
    // assert
    expect(mockNext).toHaveBeenCalled();
  });
  
  it('sends a 401 status  when a valid session cannot be found', async () => {
    // setup
    const req = {
      ...mockReq ,
      session: { email: '' }
    };
    
    // test
    await validateSession(req as unknown as Request, mockRes as unknown as Response, mockNext);
    
    // assert
    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});