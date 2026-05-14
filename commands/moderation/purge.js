module.exports = {
  name: "purge",
  execute: async (message, args) => {
    const amount = parseInt(args[0]) || 50;
    await message.channel.bulkDelete(amount, true);

    message.channel.send(`💎 Purged ${amount} messages`).then(m => setTimeout(() => m.delete(), 3000));
  }
};
