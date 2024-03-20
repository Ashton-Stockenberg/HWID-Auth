const mongoose = require('../database')

const userSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, required: true, unique: true},
    password: {type: String, required: true},
    hwid: String
})

const User = mongoose.model('User', userSchema)

module.exports = User