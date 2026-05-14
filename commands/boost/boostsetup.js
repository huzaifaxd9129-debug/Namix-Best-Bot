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
  name: "boostsetup",
  description: "Setup boost channel & message",

  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("❌ Admin only!");

    const channel = message.mentions.channels.first();
    const msg = args.slice(1).join(" ");

    if (!channel || !msg) {
      return message.reply("Usage: boostsetup #channel <message>");
    }

    const data = load();

    data[message.guild.id] = {
      channelId: channel.id,
      message: msg,
      enabled: true
    };

    save(data);

    message.reply("🚀 Boost system enabled!");
  }
};
