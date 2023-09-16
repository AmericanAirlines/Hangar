import { get } from '../../../../src/api/auth/logout/get';
import { createMockRequest } from '../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../testUtils/expressHelpers/createMockResponse';

describe('logout GET handler', () => {
  it('destroys the session and redirects home', () => {
    const mockSession = { id: 1 };
    const mockReq = createMockRequest({ session: mockSession as any });
    const mockRes = createMockResponse();

    get(mockReq as any, mockRes as any);

    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith('/');
    expect(mockReq.session).toBeNull();
  });
});
