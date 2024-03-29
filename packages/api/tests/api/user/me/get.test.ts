import { get } from '../../../../src/api/user/me/get';

const mockRequest: any = {
  user: { id: '1' },
};

const mockResponse: any = {
  send: jest.fn(),
};

describe('user me handler', () => {
  it('returns the user associated with the request', () => {
    // test
    get(mockRequest, mockResponse);
    // assert
    expect(mockResponse.send).toBeCalledWith(mockRequest.user);
  });
});
