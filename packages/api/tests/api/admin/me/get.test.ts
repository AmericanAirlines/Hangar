import { get } from '../../../../src/api/admin/me/get';

const mockRequest: any = {
  user: { id: '1' },
};

const mockResponse: any = {
  send: jest.fn(),
};

describe('admin me handler', () => {
  it('returns the admin associated with the request', () => {
    // test
    get(mockRequest, mockResponse);
    // assert
    expect(mockResponse.send).toBeCalledWith(mockRequest.user);
  });
});
