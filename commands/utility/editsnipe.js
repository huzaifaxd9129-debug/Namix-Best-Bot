module.exports = {
  name: "editsnipe",

  async execute(message, args, client) {
    const data = client.editsnipes?.get(message.channel.id);
    if (!data) return message.reply("Nothing edited.");

    message.reply(`Before: ${data.before}\nAfter: ${data.after}`);
  }
};
