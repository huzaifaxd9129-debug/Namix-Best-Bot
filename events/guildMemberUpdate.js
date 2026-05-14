const fs = require("fs");

const file = "./data/boost.json";

module.exports = async (oldMember, newMember, client) => {
  try {
    if (!fs.existsSync(file)) return;

    const data = JSON.parse(fs.readFileSync(file, "utf8"));

    const guildData = data[newMember.guild.id];
    if (!guildData || !guildData.enabled) return;

    const hadBoost = oldMember.premiumSince;
    const hasBoost = newMember.premiumSince;

    if (!hadBoost && hasBoost) {
      const channel = newMember.guild.channels.cache.get(guildData.channelId);
      if (!channel) return;

      const msg = guildData.message
        .replace("{user}", `<@${newMember.id}>`)
        .replace("{server}", newMember.guild.name);

      channel.send(msg);
    }
  } catch (err) {
    console.log("Boost Event Error:", err);
  }
};
