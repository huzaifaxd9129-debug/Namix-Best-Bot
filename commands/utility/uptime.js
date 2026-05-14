module.exports = {
  name: "uptime",
  description: "Bot uptime",

  async execute(message, args, client) {
    const uptime = process.uptime();
    message.reply(`Uptime: ${Math.floor(uptime)} seconds`);
  }
};
