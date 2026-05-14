const { PermissionsBitField } = require("discord.js");

const fs = require("fs");
const file = "./data/boost.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "boostedit",
  description: "Edit boost message",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("❌ Admin only!");

    const newMsg = args.join(" ");
    if (!newMsg) return message.reply("Provide new message");

    const data = load();

    if (!data[message.guild.id])
      return message.reply("❌ Boost system not setup");

    data[message.guild.id].message = newMsg;

    save(data);

    message.reply("✏️ Boost message updated!");
  }
};
