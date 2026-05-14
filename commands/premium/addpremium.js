const { addPremium } = require("../../utils/premium");

const OWNER_ID = "1363540480662704248";

module.exports = {
  name: "addpremium",
  category: "admin",

  run: async (client, message, args) => {

    try {

      // 🔒 OWNER CHECK
      if (message.author.id !== OWNER_ID) {
        return message.reply("❌ Only owner can use this!");
      }

      const user = message.mentions.users.first();

      const days = parseInt(args[1]) || 30;

      if (!user) {
        return message.reply("❌ Please mention a user!\nExample: `!addpremium @user 30`");
      }

      if (isNaN(days)) {
        return message.reply("❌ Invalid days number!");
      }

      addPremium(user.id, days);

      return message.channel.send(
        `💎 ${user.tag} is now Premium for ${days} days!`
      );

    } catch (err) {
      console.log(err);
      message.reply("❌ Something went wrong in command.");
    }
  }
};
