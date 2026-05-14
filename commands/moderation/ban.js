const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "ban",
  execute: async (message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ No permission.");

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mention a user.");

    await user.ban({ reason: "Banned by staff" });

    message.channel.send({
      embeds: [embed("User Banned", `${user.user.tag} has been banned.` , message.author)]
    });
  }
};
