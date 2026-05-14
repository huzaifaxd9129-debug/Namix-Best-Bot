module.exports = {
  name: "iq",
  description: "IQ test",

  async execute(message) {
    const user = message.mentions.users.first() || message.author;
    const iq = Math.floor(Math.random() * 160);

    message.reply(`🧠 ${user.username}'s IQ is ${iq}`);
  }
};
