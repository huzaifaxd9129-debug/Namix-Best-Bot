module.exports = {
  name: "firstmessage",

  async execute(message) {
    const msgs = await message.channel.messages.fetch({ limit: 1, after: 0 });
    const first = msgs.first();
    message.reply(`First message: ${first.content}`);
  }
};
