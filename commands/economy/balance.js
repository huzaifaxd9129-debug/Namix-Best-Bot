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
💰 Nexora Eco: ${user.cash}
🏦 Bank Eco: ${user.bank}
    `);

  }
};
