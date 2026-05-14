const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Show user avatar",

  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setColor("Blue");

    message.reply({ embeds: [embed] });
  }
};
