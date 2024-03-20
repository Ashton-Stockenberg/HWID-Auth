const LocalStartegy = require('passport-local')
const crypto = require('crypto')
const User = require('../db/models/User')

const startegy = new LocalStartegy(function verify(username, password, hwid, cb) {
    const user = User.findOne({ username })
}) 

module.exports = startegy