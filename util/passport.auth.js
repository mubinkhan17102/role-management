const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user.model');

passport.use(
    new LocalStrategy({
        usernameField:"email",
        passwordField: "password"
    }, async (email, password, done)=>{
        try{
            const user = await userModel.findOne({emial: email});
            // username/ email dose not exist
            if(!user){
                return done(null, false, {message:'Username/email not registered'})
            }

            //email exits . we need to varify
            const isMatch = await user.isValidPassword(password);

            if(isMatch){
                return done(null, user);
            }else{
                return done(null, false, {message: "Incorrect password"})
            }

        }catch(e){
            done(e);
        }
    })
)

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
   // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(async (id, done) =>{
    const user = await userModel.findById(id).select('_id email');
    if(user){
        done(null, user)
    }else{
        done(null, false)
    }
});