const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { UserModel } = require('../database/model')

passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password'
}, async (email, password, done) => {
    const user = await UserModel.findOne({email})
    if(!user) {
        return done(null, false, { message: 'El usuario no existe'})
    } else {
        const match = await bcrypt.compare(password, user.password)
        if(match) return done(null, user)
        else return done(null, false, { message: 'El password no es correcto'})
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
        done(err, user)
    })
})