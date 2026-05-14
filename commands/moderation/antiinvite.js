let enabled = false;

module.exports = {
  name: "antiinvite",
  execute: (message) => {
    enabled = !enabled;

    message.channel.send(`💎 Anti-invite is now ${enabled ? "ENABLED" : "DISABLED"}`);
  },
  check: (msg) => {
    if (enabled && msg.content.includes("discord.gg")) {
      msg.delete();
    }
  }
};
