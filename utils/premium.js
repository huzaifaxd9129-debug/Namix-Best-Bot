const fs = require("fs");

const file = "./data/premium.json";

function load() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ users: {}, guilds: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(file));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// check expiry
function isExpired(time) {
  if (!time) return true;
  return Date.now() > time;
}

function isPremiumUser(userId) {
  const data = load();
  const user = data.users[userId];
  if (!user) return false;
  if (isExpired(user.expiresAt)) return false;
  return true;
}

function getPremium(userId) {
  const data = load();
  return data.users[userId] || null;
}

function addPremiumUser(userId, days = 30) {
  const data = load();

  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;

  data.users[userId] = {
    expiresAt,
    claimedEco: false
  };

  save(data);
}

module.exports = {
  isPremiumUser,
  addPremiumUser,
  getPremium
};
