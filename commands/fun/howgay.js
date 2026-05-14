module.exports = {
  name: "howgay",
  description: "Check gay percentage",

  async execute(message) {
    const user = message.mentions.users.first() || message.author;
    const percent = Math.floor(Math.random() * 101);

    message.reply(`🏳️‍🌈 ${user.username} is ${percent}% gay`);
  }
};
