require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/user')
mongoose.connect(process.env.dbURL)


async function subscribeUser(message){
    
    const user = new User({
        chatId: message.chat.id,
        name: message.from.first_name,
        username: message.from.username,
        isSubscribed: true
    })

    await user.save()

}

async function getUsers(){
    var subscribedUsers = await User.find() 
    return subscribedUsers
}

async function unsubscribeUser(message){
    await User.deleteOne({
        'chatId':message.chat.id
    })
}


module.exports = {
    subscribeUser,
    getUsers,
    unsubscribeUser
}