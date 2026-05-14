const fs = require("fs");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "warn",
  execute: (message, args) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply("❌ Mention user");

    const reason = args.slice(1).join(" ") || "No reason";

    const data = JSON.parse(fs.readFileSync("./warnings.json", "utf8") || "{}");

    if (!data[user.id]) data[user.id] = [];
    data[user.id].push(reason);

    fs.writeFileSync("./warnings.json", JSON.stringify(data, null, 2));

    message.channel.send({
      embeds: [embed("User Warned", `${user.tag} warned\nReason: ${reason}`, message.author)]
    });
  }
};
