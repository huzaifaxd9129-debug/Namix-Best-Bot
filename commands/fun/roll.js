module.exports = {
  name: "roll",
  description: "Roll dice",

  async execute(message, args) {
    const max = parseInt(args[0]) || 6;
    const result = Math.floor(Math.random() * max) + 1;

    message.reply(`🎲 You rolled: ${result}`);
  }
};
