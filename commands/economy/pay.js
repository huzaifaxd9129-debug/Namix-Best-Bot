const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "pay",

  async execute(message, args) {

    const member =
      message.mentions.users.first();

    const amount =
      parseInt(args[1]);

    if (!member || isNaN(amount))
      return;

    const data = loadData();

    const user =
      getUser(data, message.author.id);

    const target =
      getUser(data, member.id);

    if (amount > user.cash)
      return message.reply("Not enough cash.");

    user.cash -= amount;
    target.cash += amount;

    saveData(data);

    message.channel.send(
      `💸 Paid ${amount} Nexora Eco`
    );

  }
};
