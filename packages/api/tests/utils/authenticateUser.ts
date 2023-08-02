import { authenticateUser , OAuthUserData } from '../../src/utils/authenticateUser'
// to test the middleware, we need to mock the request and response objects
const req = {
    session : {
        email : ''
    }
}
const res = {
    status : jest.fn(),
    send : jest.fn(),
}
// then we can test the middleware
describe('authenticate user', () => {
    it('should call next if the user is authenticated', () => {
        // setup
        const options:OAuthUserData = {
            email : 'x'
        }
        // test
        authenticateUser({options,request:(req as any),response:(res as any)})
        // assert
        expect(res.status).not.toHaveBeenCalled()
    })
    it('should call res.status(401) if the user is not authenticated', () => {
        // setup
        const options:OAuthUserData = {
            email : ''
        }
        // test
        authenticateUser({options,request:(req as any),response:(res as any)})
        // assert
        expect(res.status).toHaveBeenCalledWith(401)
    })
})