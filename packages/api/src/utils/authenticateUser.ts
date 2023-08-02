import { Response , Request } from 'express';

export type OAuthUserData = {
    email: string ,
    firstName: string ,
    lastName: string ,
    phoneNumber?: string ,
    address?: string ,
    given_name?: string ,
    family_name?: string ,
}

export const authenticateUser = ({ options , request:req , response:res }:{options:OAuthUserData,request:Request , response:Response}) => {
    // validate the request has a valid OAuthUserData object
    // if so, add it to the session
    // if not, redirect to error
    if (options.email) {
        req.session = options
        res.redirect('/')
    } else {
        res.redirect('/error')
    }
}
