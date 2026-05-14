const fs = require("fs");
const file = "./data/welcome.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

module.exports = {
  name: "welcome",

  async execute(message, args) {
    if (args[0] !== "test") return;

    const data = load();
    const config = data[message.guild.id];

    if (!config) return message.reply("❌ Welcome not setup");

    const msg = config.message
      .replace("{user}", `<@${message.author.id}>`)
      .replace("{server}", message.guild.name);

    message.channel.send(msg);
  }
};
