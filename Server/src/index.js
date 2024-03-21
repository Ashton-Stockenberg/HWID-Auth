const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('./db/database')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: process.env.DB_STRING,
    collection: 'mySessions'
  });

const passport = require('passport')
const strategy = require('./strategys/local')
passport.use(strategy)

const app = express()
const port = 3000

const jsonParser = bodyParser.json()

// * MIDDLEWARE *
app.use(jsonParser)
app.use(session({
    secret: process.env.SECRET,
    cookie: {
        maxAge: 1000*60*60*24*7
    },
    store: store,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.authenticate('session'))
app.use('/', (req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

// * ROUTES *
app.get('/', (req, res) => res.sendStatus(200))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => console.log(`Server listening on port ${port}`))
