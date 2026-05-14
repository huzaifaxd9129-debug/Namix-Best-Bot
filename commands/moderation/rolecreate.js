const { PermissionsBitField } = require("discord.js");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "rolecreate",
  execute: async (message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
      return message.reply("❌ No permission.");

    const name = args.join(" ");
    if (!name) return message.reply("❌ Provide role name.");

    const role = await message.guild.roles.create({
      name,
      color: "Random",
      reason: `Created by ${message.author.tag}`
    });

    message.channel.send({
      embeds: [embed("Role Created", `Role **${role.name}** created successfully 🎉`, message.author)]
    });
  }
};
