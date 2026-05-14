const fs = require("fs");

const file = "./data/premiumUsers.json";

function load() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ users: [], guilds: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function isPremiumUser(userId) {
  const data = load();
  return data.users.includes(userId);
}

function isPremiumGuild(guildId) {
  const data = load();
  return data.guilds.includes(guildId);
}

module.exports = {
  isPremiumUser,
  isPremiumGuild
};
