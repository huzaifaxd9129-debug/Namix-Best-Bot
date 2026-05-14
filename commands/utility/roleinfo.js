const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roleinfo",
  description: "Role information",

  async execute(message, args) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Mention a role!");

    const embed = new EmbedBuilder()
      .setTitle("Role Info")
      .addFields(
        { name: "Name", value: role.name },
        { name: "Members", value: `${role.members.size}` }
      )
      .setColor(role.color);

    message.reply({ embeds: [embed] });
  }
};
