const express = require('express')
const crypto = require('crypto')
const User = require('../db/models/User')
const passport = require('passport')
const router = express.Router()

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        console.log(`${user._id}`)
        cb(null, {id: user._id, username: user.username})
    })
})

passport.deserializeUser((user, cb) => {
    console.log(`${user}`)
    process.nextTick(() => {
        return cb(null, user)
    })
})

router.get('/', (req, res) => {
    const {user} = req
    if(!user) return res.sendStatus(404)
    res.sendStatus(200)
})

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200)
})

router.post('/create', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const hwid = req.body.hwid

    if(!username || !password || !hwid) return res.sendStatus(400)
    
    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
        if(err) return sendStatus(500)

        let user = new User({username, salt, password: hashedPassword, hwid})
        
        user.save()
            .then(() => res.sendStatus(201))
            .catch(() => res.sendStatus(400))
    })
})


module.exports = router