const mongoose = require('mongoose')

mongoose.connect(process.env.DB_STRING).then(() => console.log('Connected to DB'))

module.exports = mongoose