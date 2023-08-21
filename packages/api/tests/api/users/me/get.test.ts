import { get } from '../../../../src/api/users/me/get';

const mockRequest: any = {
  user: {},
};

const mockResponse: any = {
  json: jest.fn(),
};

describe('Check if the request body has a user', () => {
  it('returns a user when get is called', () => {
    // test
    get(mockRequest, mockResponse);
    // assert
    expect(mockResponse.json).toBeCalledWith(mockRequest.user);
  });
});
