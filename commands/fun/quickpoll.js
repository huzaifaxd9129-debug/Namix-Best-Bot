module.exports = {
  name: "quickpoll",
  description: "Create poll",

  async execute(message, args) {
    if (!args.length) return message.reply("Provide a question!");

    const msg = await message.channel.send(`📊 Poll: ${args.join(" ")}`);
    await msg.react("👍");
    await msg.react("👎");
  }
};
