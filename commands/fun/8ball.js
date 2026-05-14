const responses = [
  "Yes",
  "No",
  "Maybe",
  "Definitely",
  "I don't think so",
  "Ask again later",
  "Absolutely"
];

module.exports = {
  name: "8ball",
  description: "Magic 8ball",

  async execute(message, args) {
    if (!args.length) return message.reply("Ask a question!");

    const answer = responses[Math.floor(Math.random() * responses.length)];
    message.reply(`🎱 ${answer}`);
  }
};
