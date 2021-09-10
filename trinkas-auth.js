const users = require('usersElasticSearch')  //criar users elastic search
const passport = require('passport')
const router = require('express').Router()

module.exports = router

router.get('/trinkas/app/login', (req, res) => {

    const err = req.flash('userError')
    if(err){
        res.render('login', {
            'messages' : {
                'error' : err
            }
        })
    } else res.render('login')
})

router.post('/trinkas/app/login', (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    if(!username){
        const usernameSignUp = req.body.usernameSignUp
        return users.addUser(usernameSignUp, password)
            .then(() => {
                //associates message to userError
                req.flash('userError', 'User registered, you can now login with your credentials!')
                return res.redirect('/trinkas/app/login')
            })
    }
    users
        .getUser(username)
        .then(user => {
            if(!user) {
                req.flash('userError', `User ${username} does not exist!`)
                return res.redirect('/trinkas/app/login')
            }
            if(user.password != password){
                req.flash('userError', 'Invalid credentials!')
                return res.redirect('/trinkas/app/login')
            }
            req.logIn(user, (err) => {
                if(err) next(err)
                else res.redirect('/trinkas/app/users')
            })
        })
        .catch(next)
})

function UserError(status, msg){
    const err = Error(msg)
    err.status = status
    return err
}

passport.serializeUser(function(user, done) {
    done(null, user.username)
})
  
passport.deserializeUser(function(username, done) {
    users
        .getUser(username)
        .then(user => done(null, user))
        .catch(done)
})

