const foodListService = require("./foodListService");
const Slimbot = require("slimbot");
const dbFunctions = require("./db");
const telegramBotToken = require("./secret")
const slimbot = new Slimbot(telegramBotToken);

var subscribedChatIds = [];
var foodList;

async function openSlimBot() {
  slimbot.on("message", async message => {
    if (message.text == "/start") {
      slimbot.sendMessage(
        message.chat.id,
        "İBU Yemek Listesine Hoş Geldiniz!\nAbone olmak için- /subscribe\nHer sabah 8'de yemek listesi mesaj olarak gelsin. \nAbonelikten çıkmak için- /unsubscribe\nListeyi öğrenmek için- /list\nYardım almak için- /help"
      );
    } else if (message.text.toLowerCase() == "/help") {
      slimbot.sendMessage(
        message.chat.id,
        "Abone olmak için /subscribe yazın.\nAbonelikten çıkmak için /unsubscribe yazın."
      );
    } else if (message.text.toLowerCase() == "/list") {
      const currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      slimbot.sendMessage(message.chat.id, `${datetime}\n\n${foodList}`);
    } else if (message.text.toLowerCase() == "/subscribe") {
      if (!subscribedChatIds.includes(message.chat.id)) {
        await dbFunctions.addChatId(message);
        subscribedChatIds = await dbFunctions.getChatIds();
        slimbot.sendMessage(message.chat.id, "Yemek listesine abone oldunuz.");
      } else {
        slimbot.sendMessage(
          message.chat.id,
          "Zaten yemek listesine abonesiniz."
        );
      }
    } else if (message.text.toLowerCase() == "/unsubscribe") {
      if (subscribedChatIds.includes(message.chat.id)) {
        await dbFunctions.removeChatId(message);
        subscribedChatIds = await dbFunctions.getChatIds();
        slimbot.sendMessage(
          message.chat.id,
          "Yemek listesi aboneliğinden çıktınız."
        );
      } else {
        slimbot.sendMessage(
          message.chat.id,
          "Zaten yemek listesine abone değilsiniz."
        );
      }
    }
  });
}

async function dailyFoodList() {
  setInterval(async function () {
    foodList = await foodListService.getFoodList();
    foodList = await foodListService.foodListString(foodList);
    subscribedChatIds.forEach(chatId => {
      const currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      slimbot.sendMessage(chatId, `${datetime}\n\n${foodList}`);
    });
  }, 86400000);
}

async function main() {
  foodList = await foodListService.getFoodList();
  foodList = await foodListService.foodListString(foodList);

  subscribedChatIds = await dbFunctions.getChatIds();
  dailyFoodList();
  openSlimBot();
  slimbot.startPolling();
}

main();
