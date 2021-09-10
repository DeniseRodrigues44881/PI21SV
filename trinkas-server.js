const PORT = 1904
const HOST = 'localhost'

const STORAGE_PORT = 9200;
const STORAGE_HOST = 'localhost';

//const accessKey = 'd8218f9774fb4dd48b5b6e4d31f5767d'
const accessKey = 'c44d4075cef047828f14924ee7118ab5'

const path = require('path')
//const morgan = require('morgan')
const express = require('express')
const passport = require('passport')
const sitemap = require('express-sitemap-html')
const expressSession = require('express-session')

const trinkasDB = require('./trinkas-db')(STORAGE_HOST, STORAGE_PORT)
const spoonacularDB = require('./spoonacular-data')(accessKey)

const services = require('./trinkas-services')(trinkasDB, spoonacularDB)

const trinkasApi = require('./trinkas-web-api')(services)
const trinkasApp = require('./trinkas-web-app')(services)

const app = express()

//app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({
    secret: "Portugal campeão europeu novamente?",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use('/trinkas/api', trinkasApi)
app.use('/trinkas/app', trinkasApp)
app.use('/trinkas/auth', verifyAuthenticated)

sitemap.swagger('TRINKAS', app)

app.listen(PORT, () => {
    console.log(`TRINKAS app listening at http://${HOST}:${PORT}`)
})


app.post('/trinkas/register', register)
app.post('/trinkas/login', login)
app.post('/trinkas/logout', logout)

function serializeUser(user, done) {
    done(null, { username: user.username })
}

function deserializeUser(user, done) {
    done(null, { username: user.username })
}

const users = []

function register(req, rsp) {
    const username = req.body.username
    const password = req.body.password

    if (users.find(user => user.username == username)) {
        rsp.status(406).send("user already exists")
    } else {
        users.push({
            username: username,
            password: password
        })
        rsp.redirect('/trinkas/app/login')
    }
}

function login(req, rsp) {
    const username = req.body.username
    const password = req.body.password

    if (validateUser(username, password)) {
        req.login({
            username: username
        }, (err) => rsp.redirect('/trinkas/app'))
    } else {
        rsp.status(404).send("invalid login data")
    }
}

function logout(req, rsp) {
    req.logout()
    rsp.redirect('/trinkas/app')
}

function validateUser(username, password) {
    const found = users.find(user => user.username == username)
    if (found && found.password == password) {
        return true
    }
    return false
}

function verifyAuthenticated(req, rsp, next) {
    if (req.user) {
        return next()
    }
    rsp.status(401).send("not authorized")
}

/*
function homeNotAuthenticated(req, rsp) {
    let user = req.user ? req.user.username : "unknown"
    rsp.end(`Everybody can reach  this endpoint. Hello ${user}`)
}

function homeAuthenticated(req, rsp) {
    rsp.end(`You can only reach here if you are authenticated. Hello ${req.user.username}`)
}
*/