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
  name: "autoresponder-delete",
  description: "Delete autoresponder",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Admin only!");

    const trigger = args[0];
    if (!trigger) return message.reply("Usage: autoresponder-delete <trigger>");

    const data = load();

    if (!data[message.guild.id]?.[trigger])
      return message.reply("❌ Not found!");

    delete data[message.guild.id][trigger];
    save(data);

    message.reply(`🗑 Deleted autoresponder: **${trigger}**`);
  }
};
