const { isPremium } = require("../../utils/premium");

module.exports = {
  name: "stats",
  category: "premium",

  run: async (client, message) => {

    if (!isPremium(message.author.id)) {
      return message.reply("💎 Premium only!");
    }

    message.channel.send({
      embeds: [{
        title: "📊 Premium Stats",
        description: `User: ${message.author.username}
💎 Status: Premium Active
⚡ Perks: Enabled`,
        color: 0xFFD700
      }]
    });
  }
};
