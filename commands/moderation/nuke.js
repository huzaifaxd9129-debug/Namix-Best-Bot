const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "nuke",
  execute: async (message) => {
    const newChannel = await message.channel.clone();
    await message.channel.delete();

    newChannel.send({ embeds: [embed("Channel Nuked 💥", "Channel reset successfully", message.author)] });
  }
};
