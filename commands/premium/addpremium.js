const { addPremium } = require("../../utils/premium");

const OWNER_ID = "YOUR_DISCORD_ID"; // change this

module.exports = {
  name: "addpremium",
  category: "admin",

  run: async (client, message, args) => {

    // 🔒 ADMIN ONLY CHECK
    if (message.author.id !== OWNER_ID) {
      return message.reply("❌ Only bot owner can use this command!");
    }

    const user = message.mentions.users.first();
    const days = parseInt(args[1]) || 30;

    if (!user) {
      return message.reply("❌ Mention a user!");
    }

    addPremium(user.id, days);

    message.channel.send(
      `💎 ${user.username} is now Premium for **${days} days**!`
    );
  }
};
