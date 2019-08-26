// READ ME //
/* Prerequisites
    Install the Following: 
npm install express ejs
//for DevDependencies
npm install -D nodemon dotenv

*/

// imports express framework
const express = require('express')
// calls the express function
const app = express()
// include bcrypt for hashing passwords 
const bcrypt = require('bcrypt')

// sets the view-engine to ejs so that our application is able to read ejs syntax
app.set('view-engine', 'ejs')
// this code lets us collect the data from our Form POST method in our views
app.use(express.urlencoded({extended: false}))

// creates a user array to store all our users
// for now we use our local variables but in real world situation we are going to store our users in a database
const users = []

// on / route render the view file index.ejs
// express automatically looks into the views folder... no need to explicitly include the views folder in the path
app.get('/', (req, res) => res.render('index.ejs', {users}))

// creates a /login route for login.ejs view
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

// gets the data passed from the post request in the login view
app.post('/login', (req, res) => {
    res.render('index.ejs')
})

// creates a register route for register.ejs view
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

// gets the data passed from the post request in the register view
app.post('/register', async (req, res) => {
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

app.listen(3000)