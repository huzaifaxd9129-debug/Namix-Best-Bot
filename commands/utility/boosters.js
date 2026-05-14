module.exports = {
  name: "boosters",

  async execute(message) {
    const boosters = message.guild.members.cache.filter(m => m.premiumSince);
    message.reply(`Boosters: ${boosters.size}`);
  }
};
