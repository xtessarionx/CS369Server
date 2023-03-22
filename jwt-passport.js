import passport from 'passport';
import passportJWT from 'passport-jwt';

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

import Store from './model/storeModel.js'
const jwtsecret = 'very-secret'

export const jwtPassport = () =>{
    let params = {
        jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('bearer'),
        secretOrKey: jwtsecret
    }
    var strategy  = new JwtStrategy(params,(jwt_payload,done)=>{
        Store.findOne({storeName:jwt_payload.storeName})
         .then(store=>{
             if(store) return done(null,store)
             return done(null,false,"Invalid Store")
         }).catch(err=> done(err, false, { message: "Invalid Token Credential"} ))
    })
    passport.use(strategy)
    return {
        init: ()=>passport.initialize(),
        authenticate: (withSession=false) =>passport.authenticate('jwt', { session: withSession })
    }
}

