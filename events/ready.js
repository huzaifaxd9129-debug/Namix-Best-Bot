const { ActivityType } = require("discord.js");

module.exports = (client) => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  // STATUS SYSTEM
  client.user.setPresence({
    activities: [
      {
        name: "Made By Huztro",
        type: ActivityType.Watching
      }
    ],
    status: "online"
  });
};
