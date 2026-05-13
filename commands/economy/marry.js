const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "marry",

  async execute(message) {

    const member =
      message.mentions.users.first();

    if (!member) {
      return message.reply(
        "Mention someone to marry."
      );
    }

    if (member.id === message.author.id) {
      return message.reply(
        "❌ You can't marry yourself."
      );
    }

    const data = loadData();

    const user =
      getUser(data, message.author.id);

    const target =
      getUser(data, member.id);

    if (user.married) {
      return message.reply(
        "❌ You are already married."
      );
    }

    if (target.married) {
      return message.reply(
        "❌ That user is already married."
      );
    }

    user.married = member.id;
    target.married = message.author.id;

    saveData(data);

    message.channel.send(
      `💍 ${message.author.username} married ${member.username}`
    );

  }
};
