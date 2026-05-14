module.exports = {
  name: "serversplash",

  async execute(message) {
    const splash = message.guild.splashURL({ size: 4096 });
    if (!splash) return message.reply("No splash available.");
    message.reply(splash);
  }
};
