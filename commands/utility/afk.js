module.exports = {
  name: "afk",

  async execute(message, args, client) {
    client.afk = client.afk || new Map();
    client.afk.set(message.author.id, args.join(" ") || "AFK");

    message.reply("You are now AFK.");
  }
};
