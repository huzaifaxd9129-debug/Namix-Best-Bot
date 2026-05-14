const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "unban",
  execute: async (message, args) => {
    const id = args[0];
    await message.guild.members.unban(id);

    message.channel.send({ embeds: [embed("User Unbanned", `ID: ${id}`, message.author)] });
  }
};
