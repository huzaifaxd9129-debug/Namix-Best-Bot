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
  name: "gend",

  async execute(message, args, client) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Admin only!");

    const messageId = args[0];
    if (!messageId) return message.reply("Provide giveaway message ID");

    const data = load();

    const id = Object.keys(data).find(k => data[k].messageId === messageId);

    if (!id) return message.reply("❌ Giveaway not found");

    const g = data[id];

    const channel = await client.channels.fetch(g.channelId);
    const msg = await channel.messages.fetch(g.messageId);

    const reaction = msg.reactions.cache.get("🎉");
    const users = await reaction.users.fetch();

    const winners = users.filter(u => !u.bot).map(u => u.id);

    const winner =
      winners.length > 0
        ? `<@${winners[Math.floor(Math.random() * winners.length)]}>`
        : "No valid entries";

    channel.send(`⛔ Giveaway Force Ended!\nWinner: ${winner}`);

    g.ended = true;
    data[id] = g;
    save(data);

    message.reply("✅ Giveaway ended");
  }
};
