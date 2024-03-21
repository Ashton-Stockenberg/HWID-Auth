const mongoose = require('../database')

const userSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, required: true, index: {unique: true}},
    password: {type: Buffer, required: true},
    salt: {type: Buffer},
    hwid: String
})

const User = mongoose.model('User', userSchema)

module.exports = User