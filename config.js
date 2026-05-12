module.exports = {
  // ================= BOT SETTINGS =================
  prefix: "!",
  token: process.env.TOKEN,

  // ================= OWNERS =================
  ownerID: "1363540480662704248",

  // ================= COLORS =================
  embedColor: "#2b2d31",

  // ================= EMOJIS =================
  emoji: {
    success: "✅",
    error: "❌",
    warn: "⚠️",
    info: "ℹ️",
    ticket: "🎫",
    mod: "🛡️"
  },

  // ================= AUTOMOD DEFAULT SETTINGS =================
  automod: {
    enabled: true,
    antiLink: true,
    antiInvite: true,
    antiSpam: true,
    antiCaps: true,
    antiBadWords: true
  },

  // ================= LIMITS =================
  limits: {
    warnLimit: 3,
    spamCount: 5
  },

  // ================= STATUS TEXT (optional fallback) =================
  status: [
    "Made By Huztro",
    "Moderating Premium Servers",
    "Ensuring Uptime Stability",
    "Exculting System Diagnostics",
    "Optimizing Performance Modules"
  ]
};
