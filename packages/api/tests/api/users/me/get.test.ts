import { get } from '../../../../src/api/users/me/get';

const mockRequest: any = {
  user: { id: '1' },
};

const mockResponse: any = {
  send: jest.fn(),
};

describe('users me handler', () => {
  it('returns the user associated with the request', () => {
    // test
    get(mockRequest, mockResponse);
    // assert
    expect(mockResponse.json).toBeCalledWith(mockRequest.user);
  });
});
