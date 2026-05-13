const {
  loadData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "balance",
  aliases: ["bal"],

  async execute(message) {

    const data = loadData();

    const user = getUser(
      data,
      message.author.id
    );

    message.channel.send(`
💰 Cash: ${user.cash}
🏦 Bank: ${user.bank}
    `);

  }
};
