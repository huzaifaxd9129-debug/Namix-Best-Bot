const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "timeout",
  execute: async (message, args) => {
    const user = message.mentions.members.first();
    const time = args[1];

    if (!user || !time) return message.reply("❌ Usage: timeout @user 10m");

    await user.timeout(10 * 60 * 1000);

    message.channel.send({
      embeds: [embed("User Timed Out", `${user.user.tag} muted for ${time}`, message.author)]
    });
  }
};
