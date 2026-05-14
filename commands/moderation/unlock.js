const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "unlock",
  execute: async (message) => {
    await message.channel.permissionOverwrites.edit(message.guild.id, {
      SendMessages: true
    });

    message.channel.send({
      embeds: [embed("Channel Unlocked", "Chat is open again 🔓", message.author)]
    });
  }
};
