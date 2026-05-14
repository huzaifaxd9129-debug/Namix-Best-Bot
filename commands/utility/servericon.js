module.exports = {
  name: "servericon",

  async execute(message) {
    message.reply(message.guild.iconURL({ dynamic: true, size: 4096 }));
  }
};
