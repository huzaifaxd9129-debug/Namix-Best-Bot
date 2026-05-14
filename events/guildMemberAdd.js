const fs = require("fs");

const file = "./data/welcome.json";

// ==================================================
// SAFE JSON LOADER
// ==================================================

function load() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "{}");
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// ==================================================
// EVENT
// ==================================================

module.exports = async (member, client) => {
  try {
    if (!member || !member.guild) return;

    const data = load();
    const config = data[member.guild.id];

    // ❌ no config found
    if (!config || !config.enabled) return;

    const channel = member.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    // ==================================================
    // MESSAGE VARIABLES SYSTEM
    // ==================================================

    let msg = config.message;

    msg = msg
      .replace(/{user}/g, `<@${member.id}>`)
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)
      .replace(/{members}/g, member.guild.memberCount);

    // ==================================================
    // SEND WELCOME MESSAGE
    // ==================================================

    channel.send({
      content: msg
    });

  } catch (err) {
    console.log("❌ Welcome Event Error:", err);
  }
};
