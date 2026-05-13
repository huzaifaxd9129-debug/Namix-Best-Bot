const fs = require("fs");

module.exports = {
  name: "setup-chatbot",

  execute(message, args) {

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!channel) {
      return message.reply("❌ Mention a channel");
    }

    const file = "./chatbot.json";
    let data = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file))
      : {};

    data[message.guild.id] = {
      channel: channel.id,
      enabled: true
    };

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    message.reply(`✅ Chatbot enabled in ${channel}`);
  }
};
