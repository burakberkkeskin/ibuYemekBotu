const foodListService = require("./foodListService");
const Slimbot = require("slimbot");
const dbFunctions = require("./dbServices");
require("dotenv").config();
const slimbot = new Slimbot(process.env.TELEGRAM_TOKEN);
var cron = require('node-cron');


var subscribedUsers = [];
var foodList;
var helloMessage ="İBU Yemek Listesi Botuna Hoş Geldiniz!\nAbone olmak için- /subscribe\nHer sabah 10:30'da yemek listesi mesaj olarak gelsin. \nAbonelikten çıkmak için- /unsubscribe\nListeyi öğrenmek için- /list\nKaynak Kod İçin - /source\nYardım almak için- /help"
async function openSlimBot() {
  slimbot.on("message", async message => {
    if (message.text == "/start") {
      slimbot.sendMessage(
        message.chat.id,
        helloMessage
      );
    } else if (message.text.toLowerCase() == "/help") {
      slimbot.sendMessage(
        message.chat.id,
        helloMessage
      );
    } else if (message.text.toLowerCase() == "/list") {
      const currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear();
      if (foodList["soup"] != "") {
        var foodListString = await foodListService.foodListString(foodList);

        slimbot.sendMessage(message.chat.id, `${datetime}\n\n${foodListString}`);
      }
    } else if (message.text.toLowerCase() == "/subscribe") {
      var subscribedChatIds = [];
      subscribedUsers.forEach(user => {
        subscribedChatIds.push(user.chatId);
      });
      if (subscribedChatIds.includes(message.chat.id)) {
        slimbot.sendMessage(
          message.chat.id,
          "Zaten yemek listesine abonesiniz."
        );
      } else {
        await dbFunctions.subscribeUser(message);
        slimbot.sendMessage(message.chat.id, "Yemek listesine abone oldunuz.\nHer sabah saat 10:30'da yemek listesi mesaj olarak iletilecektir.");
        subscribedUsers = await dbFunctions.getUsers();
      }
    } else if (message.text.toLowerCase() == "/unsubscribe") {
      var subscribedChatIds = [];
      subscribedUsers.forEach(user => {
        subscribedChatIds.push(user.chatId);
      });
      if (!subscribedChatIds.includes(message.chat.id)) {
        slimbot.sendMessage(
          message.chat.id,
          "Zaten yemek listesine abone değilsiniz."
        );
      } else {
        await dbFunctions.unsubscribeUser(message);
        slimbot.sendMessage(message.chat.id, "Abonelikten Çıktınız.");
        subscribedUsers = await dbFunctions.getUsers();
      }
    } else if (message.text.toLowerCase() == "/source"){
      slimbot.sendMessage(message.chat.id, "https://github.com/safderun/ibuYemekBotu");
    }
  });
}

cron.schedule('00 30 13 * * *', async ()=>{
  foodList = await foodListService.getFoodList();
    if (foodList["soup"] != "") {
      foodList = await foodListService.foodListString(foodList);
      subscribedUsers.forEach(user => {
        const currentdate = new Date();
        var datetime =
          currentdate.getDate() +
          "/" +
          (currentdate.getMonth() + 1) +
          "/" +
          currentdate.getFullYear();
        slimbot.sendMessage(user.chatId, `${datetime}\n\n${foodList}`);
      });
    }
})



async function main() {
  console.log("IBU_YEMEK_BOTU Started");
  foodList = await foodListService.getFoodList();

  subscribedUsers = await dbFunctions.getUsers();
  openSlimBot();
  slimbot.startPolling();
}

main();
