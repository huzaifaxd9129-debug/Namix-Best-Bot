module.exports = {
  name: "ping",
  description: "Bot latency",

  async execute(message, args, client) {
    const msg = await message.reply("Pinging...");
    msg.edit(`🏓 Pong! Latency: ${msg.createdTimestamp - message.createdTimestamp}ms`);
  }
};
