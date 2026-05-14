const fs = require("fs");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "listwarns",
  execute: (message, args) => {
    const user = message.mentions.users.first();
    if (!user) return;

    const data = JSON.parse(fs.readFileSync("./warnings.json", "utf8") || "{}");

    const warns = data[user.id] || [];

    message.channel.send({
      embeds: [embed("Warnings List", warns.length ? warns.join("\n") : "No warnings", message.author)]
    });
  }
};
