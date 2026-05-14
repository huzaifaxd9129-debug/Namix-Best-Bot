const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "addrole",
  execute: async (message) => {
    const user = message.mentions.members.first();
    const role = message.mentions.roles.first();

    await user.roles.add(role);

    message.channel.send({ embeds: [embed("Role Added", `${role.name} added to ${user.user.tag}`, message.author)] });
  }
};
