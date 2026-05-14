const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "untimeout",
  execute: async (message) => {
    const user = message.mentions.members.first();
    if (!user) return;

    await user.timeout(null);

    message.channel.send({
      embeds: [embed("Timeout Removed", `${user.user.tag} is unmuted`, message.author)]
    });
  }
};
