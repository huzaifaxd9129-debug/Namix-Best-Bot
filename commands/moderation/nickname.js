const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "nickname",
  execute: async (message, args) => {
    const user = message.mentions.members.first();
    const nick = args.slice(1).join(" ");

    await user.setNickname(nick);

    message.channel.send({ embeds: [embed("Nickname Changed", `${user.user.tag} → ${nick}`, message.author)] });
  }
};
