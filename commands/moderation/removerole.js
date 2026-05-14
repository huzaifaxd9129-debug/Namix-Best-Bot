const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "removerole",
  execute: async (message) => {
    const user = message.mentions.members.first();
    const role = message.mentions.roles.first();

    await user.roles.remove(role);

    message.channel.send({ embeds: [embed("Role Removed", `${role.name} removed from ${user.user.tag}`, message.author)] });
  }
};
