module.exports = {
  name: "hot",
  description: "Hot meter",

  async execute(message) {
    const user = message.mentions.users.first() || message.author;
    const percent = Math.floor(Math.random() * 101);

    message.reply(`🔥 ${user.username} is ${percent}% hot`);
  }
};
