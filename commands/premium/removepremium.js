const fs = require("fs");

const OWNER_ID = "YOUR_DISCORD_ID";

module.exports = {
  name: "removepremium",
  category: "admin",

  run: async (client, message) => {

    if (message.author.id !== OWNER_ID) {
      return message.reply("❌ Only owner!");
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply("Mention user!");

    const file = "./data/premium.json";
    const data = JSON.parse(fs.readFileSync(file));

    delete data.users[user.id];

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    message.channel.send(`💔 Removed premium from ${user.username}`);
  }
};
