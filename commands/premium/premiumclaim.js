const fs = require("fs");
const { isPremium, getPremium } = require("../../utils/premium");

const ecoFile = "./data/economy.json";

module.exports = {
  name: "premiumclaim",
  category: "premium",

  run: async (client, message) => {

    if (!isPremium(message.author.id)) {
      return message.reply("💎 Premium only command!");
    }

    const data = JSON.parse(fs.readFileSync(ecoFile));

    if (!data[message.author.id]) {
      data[message.author.id] = { cash: 0 };
    }

    const premium = getPremium(message.author.id);

    if (premium.claimed) {
      return message.reply("❌ You already claimed this month!");
    }

    data[message.author.id].cash += 100000;
    premium.claimed = true;

    fs.writeFileSync(ecoFile, JSON.stringify(data, null, 2));

    const premiumData = JSON.parse(fs.readFileSync("./data/premium.json"));
    premiumData.users[message.author.id] = premium;

    fs.writeFileSync("./data/premium.json", JSON.stringify(premiumData, null, 2));

    message.channel.send("💰 You received **100,000 coins**!");
  }
};
