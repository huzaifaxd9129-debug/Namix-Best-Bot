const { EmbedBuilder } = require("discord.js");

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
  name: "gstart",
  description: "Start a giveaway",

  async execute(message, args) {
    if (!message.member.permissions.has("Administrator"))
      return message.reply("❌ Admin only!");

    const channel = message.mentions.channels.first();
    const time = parseInt(args[1]);
    const prize = args.slice(2).join(" ");

    if (!channel || !time || !prize) {
      return message.reply("Usage: gstart #channel <seconds> <prize>");
    }

    const data = load();

    const id = Date.now().toString();

    const embed = new EmbedBuilder()
      .setTitle("🎉 GIVEAWAY")
      .setDescription(`Prize: **${prize}**\nReact 🎉 to join!\nTime: ${time}s`)
      .setColor("Gold");

    const msg = await channel.send({ embeds: [embed] });
    await msg.react("🎉");

    data[id] = {
      channelId: channel.id,
      messageId: msg.id,
      guildId: message.guild.id,
      prize,
      endTime: Date.now() + time * 1000,
      ended: false
    };

    save(data);

    setTimeout(() => endGiveaway(id, message.client), time * 1000);

    message.reply("✅ Giveaway started!");
  }
};

// internal end function
async function endGiveaway(id, client) {
  const data = load();
  const g = data[id];
  if (!g || g.ended) return;

  const channel = await client.channels.fetch(g.channelId);
  const msg = await channel.messages.fetch(g.messageId);

  const reaction = msg.reactions.cache.get("🎉");
  if (!reaction) return;

  const users = await reaction.users.fetch();
  const winners = users.filter(u => !u.bot).map(u => u.id);

  const winner =
    winners.length > 0
      ? `<@${winners[Math.floor(Math.random() * winners.length)]}>`
      : "No valid entries";

  channel.send(`🎉 Giveaway Ended!\nWinner: ${winner}\nPrize: **${g.prize}**`);

  g.ended = true;
  data[id] = g;
  save(data);
}
