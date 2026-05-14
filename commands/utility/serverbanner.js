module.exports = {
  name: "serverbanner",

  async execute(message) {
    const banner = message.guild.bannerURL({ size: 4096 });
    if (!banner) return message.reply("No banner set.");
    message.reply(banner);
  }
};
