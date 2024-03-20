const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('./db/database')

const passport = require('passport')
const strategy = require('./strategys/local')
passport.use(strategy)

const app = express()
const port = 3000

// * MIDDLEWARE *
app.use('/', (req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
})

// * ROUTES *
app.get('/', (req, res) => res.sendStatus(200))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => console.log(`Server listening on port ${port}`))
