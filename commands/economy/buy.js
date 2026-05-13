const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

const items = {
  Vip_Rank: 10000,
  Master_Rank: 50000,
  Eco_Mastery_Rank: 100000
};

module.exports = {
  name: "buy",

  async execute(message, args) {

    const item =
      args[0]?.toLowerCase();

    if (!items[item])
      return message.reply("Item not found.");

    const data = loadData();

    const user =
      getUser(data, message.author.id);

    const price = items[item];

    if (price > user.cash)
      return message.reply("Not enough cash.");

    user.cash -= price;

    user.inventory.push(item);

    saveData(data);

    message.channel.send(
      `🛒 Bought ${item}`
    );

  }
};
