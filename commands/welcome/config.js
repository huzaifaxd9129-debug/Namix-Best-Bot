const fs = require("fs");
const file = "./data/welcome.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

module.exports = {
  name: "welcome",

  async execute(message, args) {
    if (args[0] !== "config") return;

    const data = load();
    const config = data[message.guild.id];

    if (!config)
      return message.reply("❌ No welcome system found");

    message.reply(
      `📦 **Welcome Config**\n\nChannel: <#${config.channelId}>\nMessage: ${config.message}\nStatus: ${config.enabled ? "ON" : "OFF"}`
    );
  }
};
