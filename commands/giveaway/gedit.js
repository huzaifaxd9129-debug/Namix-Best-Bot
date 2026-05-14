const fs = require("fs");
const file = "./data/giveaways.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "gedit",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Admin only!");

    const messageId = args[0];
    const newTime = parseInt(args[1]);

    if (!messageId || !newTime)
      return message.reply("Usage: gedit <messageId> <seconds>");

    const data = load();
    const id = Object.keys(data).find(k => data[k].messageId === messageId);

    if (!id) return message.reply("❌ Giveaway not found");

    data[id].endTime = Date.now() + newTime * 1000;

    save(data);

    message.reply("⏱ Giveaway time updated (restart bot timer manually if needed)");
  }
};
