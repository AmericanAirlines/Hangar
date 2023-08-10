import { authenticateUser, OAuthUserData } from '../../src/utils/authenticateUser';
// to test the middleware, we need to mock the request and response objects
const req: any = {
  session: {
    email: '',
  },
};
const res = {
  redirect: jest.fn(),
};

// then we can test the middleware
describe('authenticate user', () => {
  it('should call redirect to "/" if the user is authenticated', () => {
    // setup
    const data: OAuthUserData = {
      email: 'x',
      firstName: 'a',
      lastName: 'b',
    };
    // test
    authenticateUser({ data, req, res } as any);
    // assert
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });
});
