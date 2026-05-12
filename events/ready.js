const { ActivityType } = require("discord.js");

module.exports = (client) => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  const statuses = [
    { name: "Made By Huztro", type: ActivityType.Watching },
    { name: "Moderating Premium Servers", type: ActivityType.Playing },
    { name: "Ensuring Uptime Stability", type: ActivityType.Watching },
    { name: "Exculting System Diagnostics", type: ActivityType.Listening },
    { name: "Optimizing Perfomance Modules", type: ActivityType.Competing }
  ];

  let i = 0;

  setInterval(() => {
    const status = statuses[i];

    client.user.setPresence({
      activities: [status],
      status: "online"
    });

    i = (i + 1) % statuses.length;
  }, 5000);
};
