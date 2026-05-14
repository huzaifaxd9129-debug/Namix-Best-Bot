const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "slowmode",
  execute: async (message, args) => {
    const time = parseInt(args[0]);
    await message.channel.setRateLimitPerUser(time);

    message.channel.send({
      embeds: [embed("Slowmode Set", `Slowmode: ${time}s`, message.author)]
    });
  }
};
