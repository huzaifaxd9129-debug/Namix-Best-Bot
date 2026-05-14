const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "unhide",
  execute: async (message) => {
    await message.channel.permissionOverwrites.edit(message.guild.id, {
      ViewChannel: true
    });

    message.channel.send({ embeds: [embed("Channel Visible", "Channel is now visible 👁️", message.author)] });
  }
};
