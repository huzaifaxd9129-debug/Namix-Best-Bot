const fs = require("fs");

module.exports = {
  name: "setbirthday",
  category: "premium",

  run: async (client, message, args) => {

    const date = args[0];
    if (!date) return message.reply("Format: DD-MM");

    const file = "./data/birthdays.json";

    const data = JSON.parse(fs.readFileSync(file));

    data[message.author.id] = date;

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    message.reply("🎂 Birthday saved!");
  }
};
