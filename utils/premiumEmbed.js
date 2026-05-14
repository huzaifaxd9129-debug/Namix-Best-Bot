const { EmbedBuilder } = require("discord.js");

module.exports = (title, desc, user) => {
  return new EmbedBuilder()
    .setColor("#2b2d31")
    .setTitle(`💎 ${title}`)
    .setDescription(desc)
    .setFooter({ text: `Action by ${user.tag}`, iconURL: user.displayAvatarURL() })
    .setTimestamp();
};
