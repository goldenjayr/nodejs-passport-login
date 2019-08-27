// READ ME //
/* Prerequisites
    Install the Following: 
npm install express ejs
//for DevDependencies
npm install -D nodemon dotenv

*/

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// imports express framework
const express = require('express')
// calls the express function
const app = express()
// include bcrypt for hashing passwords 
const bcrypt = require('bcrypt')
// include passportjs for login authentication purposes
const passport = require('passport')
const flash= require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')

// imports initialize function to the file to lessen code
const initializePassport = require('./passport-config')

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// sets the view-engine to ejs so that our application is able to read ejs syntax
app.set('view engine', 'ejs')
// sets the over all layout of the project
app.set('layout', 'layouts/layout')
// this code lets us collect the data from our Form POST method in our views
app.use(express.urlencoded({extended: false}))
app.use(expressLayouts)
// this code omits the public when calling the the css from the styles folder
app.use(express.static('public'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
// method override is used to override post requests if there is no available default methods... like delete and put
app.use(methodOverride('_method'))




// creates a user array to store all our users
// for now we use our local variables but in real world situation we are going to store our users in a database
const users = []

// on / route render the view file index.ejs
// express automatically looks into the views folder... no need to explicitly include the views folder in the path
app.get('/', checkAuthenticated, (req, res) => res.render('index.ejs', {name: req.body.name}))

// creates a /login route for login.ejs view
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

// gets the data passed from the post request in the login view
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

// creates a register route for register.ejs view
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

// gets the data passed from the post request in the register view
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // adds the new user to the users array
        users.push({
            // adds a unique id
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.render('login.ejs')
    } catch (error) {
        res.render('register.ejs')
    }
})

// delete method logs out the user
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()    
}

app.listen(3000)