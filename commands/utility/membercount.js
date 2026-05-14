module.exports = {
  name: "membercount",
  description: "Show member count",

  async execute(message) {
    message.reply(`👥 Members: ${message.guild.memberCount}`);
  }
};
