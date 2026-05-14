const fs = require("fs");
const file = "./data/giveaways.json";

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

module.exports = {
  name: "greroll",

  async execute(message, args, client) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Admin only!");

    const messageId = args[0];
    if (!messageId) return message.reply("Provide giveaway message ID");

    const data = load();
    const id = Object.keys(data).find(k => data[k].messageId === messageId);

    if (!id) return message.reply("❌ Not found");

    const g = data[id];

    const channel = await client.channels.fetch(g.channelId);
    const msg = await channel.messages.fetch(g.messageId);

    const users = await msg.reactions.cache.get("🎉").users.fetch();
    const list = users.filter(u => !u.bot).map(u => u.id);

    if (!list.length) return message.reply("❌ No entries");

    const winner = `<@${list[Math.floor(Math.random() * list.length)]}>`;

    channel.send(`🔁 New Winner: ${winner}`);
  }
};
