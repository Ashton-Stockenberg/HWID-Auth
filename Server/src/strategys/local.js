const LocalStartegy = require('passport-local')
const crypto = require('crypto')
const User = require('../db/models/User')

const startegy = new LocalStartegy({passReqToCallback: true}, async function verify(req, username, password, cb) {
    const user = await User.findOne({ username })
    let hwid = req.body.hwid

    if(!user || !hwid) return cb(null, false, {message: 'Incorrect credentials'})
    if(user.hwid != hwid) return cb(null, false, {message: 'Incorrect credentials'})

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if(err) return false
        
        if(!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return cb(null, false, {message: 'Incorrect credentials'})
        }

        return cb(null, user)
    })
}) 

module.exports = startegy