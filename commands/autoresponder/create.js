const fs = require("fs");
const file = "./data/autoresponder.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "autoresponder-create",
  description: "Create autoresponder",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Admin only!");

    const trigger = args[0];
    const response = args.slice(1).join(" ");

    if (!trigger || !response)
      return message.reply("Usage: autoresponder-create <trigger> <response>");

    const data = load();

    if (!data[message.guild.id]) data[message.guild.id] = {};
    data[message.guild.id][trigger] = response;

    save(data);

    message.reply(`✅ Autoresponder created:\n**${trigger} → ${response}**`);
  }
};
