module.exports = {
  name: "snipe",

  async execute(message, args, client) {
    const data = client.snipes?.get(message.channel.id);
    if (!data) return message.reply("Nothing to snipe.");

    message.reply(`${data.author}: ${data.content}`);
  }
};
