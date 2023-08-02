import { authenticateUser , OAuthUserData } from '../../src/utils/authenticateUser'
// to test the middleware, we need to mock the request and response objects
const req:any = {
    session : {
        email : ''
    }
}
const res:any = {
    status : jest.fn(),
    send : jest.fn(),
}
// then we can test the middleware
describe('authenticate user', () => {
    it('should call redirect to "/" if the user is authenticated', () => {
        // setup
        const options:OAuthUserData = {
            email : 'x' ,
            firstName:'a' ,
            lastName:'b' ,
        }
        // test
        authenticateUser({options,request:req,response:res})
        // assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith('/');
    })
    
    it('should call redirect to "/error" if the user is not authenticated', () => {
        // setup
        const options:OAuthUserData = {
            email : '' ,
            firstName:'a' ,
            lastName:'b' ,
        }
        // test
        authenticateUser({options,request:req,response:res})
        // assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith('/error');
    })
})