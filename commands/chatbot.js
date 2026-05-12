const fs = require("fs");

const file = "./data/chatbot.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "chatbot",
  aliases: ["ai"],

  async execute(message, args) {

    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Admin only.");
    }

    const data = load();
    const cmd = args[0];

    // ================= HELP =================
    if (!cmd) {
      return message.channel.send(`
🤖 CHATBOT COMMANDS

!chatbot enable #channel
!chatbot disable
      `);
    }

    // ================= ENABLE =================
    if (cmd === "enable") {
      const channel = message.mentions.channels.first();

      if (!channel) {
        return message.reply("❌ Mention a channel.");
      }

      data[message.guild.id] = {
        channel: channel.id
      };

      save(data);

      return message.channel.send(`🤖 Chatbot enabled in ${channel}`);
    }

    // ================= DISABLE =================
    if (cmd === "disable") {
      delete data[message.guild.id];
      save(data);

      return message.channel.send("❌ Chatbot disabled.");
    }
  }
};
