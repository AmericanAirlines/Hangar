import { Response , Request } from 'express';

export type OAuthUserData = {
    email : string ,
    firstName : string ,
    lastName : string ,
    phoneNumber ?: string ,
    address ?: string ,
    given_name ?: string ,
    family_name ?: string ,
}
type AuthenticateArgs = {
    options : OAuthUserData ,
    req : Request ,
    res : Response
}
export const authenticateUser = ({ options , req , res }:AuthenticateArgs) => {
    // validate the request has a valid OAuthUserData object
    // if so, add it to the session
    // if not, redirect to error
    if (options.email) {
        req.session = options
        res.redirect('/')
    }
    else {
        res.redirect('/error')
    }
}
