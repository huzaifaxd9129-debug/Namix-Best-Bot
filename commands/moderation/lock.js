const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "lock",
  execute: async (message) => {
    await message.channel.permissionOverwrites.edit(message.guild.id, {
      SendMessages: false
    });

    message.channel.send({
      embeds: [embed("Channel Locked", "Chat has been locked 🔒", message.author)]
    });
  }
};
