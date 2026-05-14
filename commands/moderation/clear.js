const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "clear",
  execute: async (message, args) => {
    const amount = parseInt(args[0]);
    if (!amount) return;

    await message.channel.bulkDelete(amount);

    message.channel.send({
      embeds: [embed("Messages Cleared", `Deleted ${amount} messages`, message.author)]
    });
  }
};
