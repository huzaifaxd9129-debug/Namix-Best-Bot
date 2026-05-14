const fs = require("fs");
const file = "./data/autoresponder.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

module.exports = {
  name: "autoresponder-list",
  description: "List autoresponders",

  async execute(message) {
    const data = load();
    const guildData = data[message.guild.id];

    if (!guildData || Object.keys(guildData).length === 0)
      return message.reply("❌ No autoresponders found.");

    const list = Object.entries(guildData)
      .map(([k, v]) => `**${k} → ${v}**`)
      .join("\n");

    message.reply(`📜 **Autoresponders:**\n${list}`);
  }
};
