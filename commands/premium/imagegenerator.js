module.exports = {
  name: "imagine",
  category: "premium",

  run: async (client, message, args) => {

    const prompt = args.join(" ");

    if (!prompt) return message.reply("Give prompt!");

    message.reply("🎨 Generating image...");

    setTimeout(() => {
      message.channel.send({
        embeds: [{
          title: "🧠 AI Image (Simulated)",
          description: prompt,
          image: {
            url: "https://dummyimage.com/600x400/000/fff&text=AI+IMAGE"
          }
        }]
      });
    }, 3000);
  }
};
