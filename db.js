const fs = require('fs').promises;



async function getChatIds(){
    const jsonString = await fs.readFile('./db.json');
    const db = JSON.parse(jsonString);
    return db.chatIdList
}

async function addChatId(message){
    chatIdList = await getChatIds()
    chatIdList.push(message.chat.id)
    var jsonString = JSON.stringify({chatIdList})
    await fs.writeFile('./db.json', jsonString)
    const currentdate = new Date()
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    await fs.appendFile('./log.txt', `${datetime} INFO:  @${message.chat.username} Subscribed\n`)
}

async function removeChatId(message){
    chatIdList = await getChatIds()
    chatIdList = chatIdList.filter(e => e !== message.chat.id);
    var jsonString = JSON.stringify({chatIdList})
    await fs.writeFile('./db.json', jsonString)

    const currentdate = new Date()
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    await fs.appendFile('./log.txt', `${datetime} INFO: ${message.chat.username} Unubscribed\n`)
}


module.exports = {
    getChatIds,
    addChatId,
    removeChatId
}