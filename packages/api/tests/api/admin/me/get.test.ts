import { get } from '../../../../src/api/admin/me/get';
import { createMockRequest } from '../../../testUtils/expressHelpers/createMockRequest';
import { createMockResponse } from '../../../testUtils/expressHelpers/createMockResponse';

describe('admin GET me handler', () => {
  it('returns the admin associated with the request', () => {
    const admin = { id: 1 };
    const mockRequest = createMockRequest({
      admin: admin as any,
    });
    const mockResponse = createMockResponse();
    get(mockRequest as any, mockResponse as any);
    expect(mockResponse.send).toBeCalledWith(admin);
  });
});
