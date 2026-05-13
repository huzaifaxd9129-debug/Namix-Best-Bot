const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "gamble",

  async execute(message, args) {

    const data = loadData();

    const user = getUser(data, message.author.id);

    const amount = parseInt(args[0]);

    if (isNaN(amount))
      return message.reply("Enter amount.");

    if (amount > user.cash)
      return message.reply("Not enough cash.");

    const win =
      Math.random() < 0.5;

    if (win) {

      user.cash += amount;

      message.channel.send(
        `🎉 You won ${amount}`
      );

    } else {

      user.cash -= amount;

      message.channel.send(
        `❌ You lost ${amount}`
      );

    }

    saveData(data);

  }
};
