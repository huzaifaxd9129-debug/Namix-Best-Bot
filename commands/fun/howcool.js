module.exports = {
  name: "howcool",
  description: "Check coolness",

  async execute(message) {
    const user = message.mentions.users.first() || message.author;
    const percent = Math.floor(Math.random() * 101);

    message.reply(`😎 ${user.username} is ${percent}% cool`);
  }
};
