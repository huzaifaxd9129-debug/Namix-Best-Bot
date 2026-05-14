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
  name: "autoresponder-edit",
  description: "Edit autoresponder",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Admin only!");

    const trigger = args[0];
    const newResponse = args.slice(1).join(" ");

    if (!trigger || !newResponse)
      return message.reply("Usage: autoresponder-edit <trigger> <new response>");

    const data = load();

    if (!data[message.guild.id]?.[trigger])
      return message.reply("❌ Trigger not found!");

    data[message.guild.id][trigger] = newResponse;
    save(data);

    message.reply(`✏️ Updated:\n**${trigger} → ${newResponse}**`);
  }
};
