const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "deposit",
  aliases: ["dep"],

  async execute(message, args) {

    const data = loadData();

    const user = getUser(data, message.author.id);

    const amount = parseInt(args[0]);

    if (isNaN(amount))
      return message.reply("Enter amount.");

    if (amount > user.cash)
      return message.reply("Not enough cash.");

    user.cash -= amount;
    user.bank += amount;

    saveData(data);

    message.channel.send(
      `🏦 Deposited ${amount}`
    );

  }
};
