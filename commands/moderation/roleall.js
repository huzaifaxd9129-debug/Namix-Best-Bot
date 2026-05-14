const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

let toggle = true; // true = give, false = remove

module.exports = {
  name: "roleall",
  execute: async (message) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
      return message.reply("❌ No permission.");

    const role = message.mentions.roles.first();
    if (!role) return message.reply("❌ Mention a role.");

    const members = await message.guild.members.fetch();

    members.forEach(async (m) => {
      if (toggle) {
        if (!m.roles.cache.has(role.id)) await m.roles.add(role).catch(() => {});
      } else {
        if (m.roles.cache.has(role.id)) await m.roles.remove(role).catch(() => {});
      }
    });

    toggle = !toggle;

    message.channel.send({
      embeds: [embed(
        "Role All Executed",
        toggle ? `Next run will REMOVE role from everyone 🔁` : `Next run will GIVE role to everyone 🔁`,
        message.author
      )]
    });
  }
};
