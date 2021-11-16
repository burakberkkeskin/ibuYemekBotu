const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('dotenv').config()


const userSchema = new Schema({
    chatId: Number,
    name: String,
    username: String,
    isSubscribed: Boolean
}, {timestamps: true})

const user = mongoose.model('User', userSchema)
module.exports = user