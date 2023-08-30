import { get } from '../../../../src/api/admin/me/get';

const test = {
  user: '1',
};

const mockRequest: any = {
  user: { id: '1' },
  admin: test,
};

const mockResponse: any = {
  send: jest.fn(),
};

describe('admin me handler', () => {
  it('returns the admin associated with the request', () => {
    // test
    get(mockRequest, mockResponse);
    // assert
    expect(mockResponse.send).toBeCalledWith(test);
  });
});
