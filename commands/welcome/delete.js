const { PermissionsBitField } = require("discord.js");

const fs = require("fs");
const file = "./data/welcome.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "welcome",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("❌ Admin only!");

    if (args[0] !== "delete") return;

    const data = load();

    delete data[message.guild.id];

    save(data);

    message.reply("🗑 Welcome system deleted!");
  }
};
