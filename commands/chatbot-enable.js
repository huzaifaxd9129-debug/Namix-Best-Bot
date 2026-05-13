const fs = require("fs");

module.exports = {
  name: "chatbot-enable",

  execute(message) {

    const file = "./chatbot.json";
    let data = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file))
      : {};

    if (!data[message.guild.id]) {
      return message.reply("❌ Setup chatbot first");
    }

    data[message.guild.id].enabled = true;

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    message.reply("✅ Chatbot enabled");
  }
};
