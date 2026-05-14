module.exports = {
  name: "bots",

  async execute(message) {
    const bots = message.guild.members.cache.filter(m => m.user.bot);
    message.reply(`Bots: ${bots.size}`);
  }
};
