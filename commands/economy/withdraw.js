const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "withdraw",
  aliases: ["with"],

  async execute(message, args) {

    const data = loadData();

    const user = getUser(data, message.author.id);

    const amount = parseInt(args[0]);

    if (isNaN(amount))
      return message.reply("Enter amount.");

    if (amount > user.bank)
      return message.reply("Not enough bank.");

    user.bank -= amount;
    user.cash += amount;

    saveData(data);

    message.channel.send(
      `💸 Withdrew ${amount}`
    );

  }
};
