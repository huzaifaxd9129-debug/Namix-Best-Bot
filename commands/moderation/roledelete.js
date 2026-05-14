const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "roledelete",
  execute: async (message) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
      return message.reply("❌ No permission.");

    const role = message.mentions.roles.first();
    if (!role) return message.reply("❌ Mention a role.");

    await role.delete();

    message.channel.send({
      embeds: [embed("Role Deleted", `Role **${role.name}** deleted 🗑️`, message.author)]
    });
  }
};
