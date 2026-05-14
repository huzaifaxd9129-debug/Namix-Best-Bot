module.exports = {
  name: "clearsnipes",

  async execute(message, args, client) {
    client.snipes?.delete(message.channel.id);
    client.editsnipes?.delete(message.channel.id);
    message.reply("Snipes cleared.");
  }
};
