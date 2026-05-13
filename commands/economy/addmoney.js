const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "addmoney",

  async execute(message, args) {

    if (
      !message.member.permissions.has("Administrator")
    ) {
      return message.reply(
        "❌ Administrator permission required."
      );
    }

    const member =
      message.mentions.users.first();

    const amount =
      parseInt(args[1]);

    if (!member || isNaN(amount)) {
      return message.reply(
        "Usage: !addmoney @user amount"
      );
    }

    const data = loadData();

    const user =
      getUser(data, member.id);

    user.cash += amount;

    saveData(data);

    message.channel.send(
      `✅ Added ${amount} Nexora Eco to ${member.username}`
    );

  }
};
