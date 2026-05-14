const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "kick",
  execute: async (message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("❌ No permission.");

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mention user.");

    await user.kick();

    message.channel.send({
      embeds: [embed("User Kicked", `${user.user.tag} was kicked.` , message.author)]
    });
  }
};
