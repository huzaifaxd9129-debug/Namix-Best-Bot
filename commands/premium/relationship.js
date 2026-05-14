module.exports = {
  name: "relationship",
  category: "premium",

  run: async (client, message) => {

    const user = message.mentions.users.first();
    if (!user) return message.reply("Mention someone!");

    const percent = Math.floor(Math.random() * 100);

    message.channel.send({
      embeds: [{
        title: "💘 Relationship Result",
        description: `${message.author} ❤️ ${user}
💯 Compatibility: ${percent}%`,
        color: 0xFF69B4
      }]
    });
  }
};
