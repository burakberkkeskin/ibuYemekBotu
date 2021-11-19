const axios = require("axios");
const cheerio = require("cheerio");
const url = "http://ibu.edu.tr/yemek-listesi";

async function getFoodList() {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const date = $(".bugununYemegi .ylsGun");

    const soup = $(".bugununYemegi .ylsCorba .ikiliYlninYaziAlani");
    const soupCal = $(".bugununYemegi .ylsCorba .kaloriSpani");

    const mainCouse = $(".bugununYemegi .ylsAnaYemek .ylninYemekAlani");
    const mainCouseCal = $(".bugununYemegi .ylsAnaYemek .kaloriSpani");

    const secondCouse = $(".bugununYemegi .ylsYardimciYemek .ylninYemekAlani");
    const secondCouseCal = $(".bugununYemegi .ylsYardimciYemek .kaloriSpani");

    const sideCouse = $(".bugununYemegi .ylsYanYemek .ikiliYlninYaziAlani");
    const sideCouseCal = $(".bugununYemegi .ylsYanYemek .kaloriSpani");

    var foodList = {
        soup: soup.text(),
        soupCal: soupCal.text(),
        mainCouse: mainCouse.text(),
        mainCouseCal: mainCouseCal.text(),
        secondCouse: secondCouse.text(),
        secondCouseCal: secondCouseCal.text(),
        sideCouse: sideCouse.text(),
        sideCouseCal: sideCouseCal.text(),
    };
    return foodList;
}

async function foodListString(list) {
    var foodList =
        "Çorba:" +
        list["soup"] +
        "\nAna Yemek:" +
        list["mainCouse"] +
        "\nİkinci Yemek:" +
        list["secondCouse"] +
        "\nYan Yemekler:" +
        list["sideCouse"];
    return foodList;
}

module.exports = {
    getFoodList,
    foodListString,
};
