const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const UserDB = require('../models/user');
const dotenv=require('dotenv').config();

passport.use(new googleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
}, async function (accessToken, refreshToken, profile, done) {
    // console.log(profile);
    // console.log("name: ", profile.displayName);
    // console.log("email", profile._json.email);
    // console.log("pic", profile._json.picture);

    try {
        let user = await UserDB.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null,user);
        }
        else{
            let newUser=await UserDB.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                avatar:profile.photos[0].value,
                // avatar:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',

                password:crypto.randomBytes(20).toString('hex')
    
            })
            // console.log(typeof(newUser.avatar));
            return done(null,newUser);
        }
    } 
    catch (err) {
        console.log("error in passport :: ",err);
        return done(err);
    }


}))


module.exports.passport;