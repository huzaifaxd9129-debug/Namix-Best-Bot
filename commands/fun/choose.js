module.exports = {
  name: "choose",
  description: "Choose between options",

  async execute(message, args) {
    if (!args.length) return message.reply("Give options separated by commas!");

    const options = args.join(" ").split(",");
    const pick = options[Math.floor(Math.random() * options.length)];

    message.reply(`🤔 I choose: **${pick.trim()}**`);
  }
};
