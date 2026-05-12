const automod = require("../commands/automod");
const chatbotDataFile = require("../data/chatbot.json");
const axios = require("axios");
const fs = require("fs");

function loadChatbot() {
  if (!fs.existsSync(chatbotDataFile)) {
    fs.writeFileSync(chatbotDataFile, "{}");
  }
  return JSON.parse(fs.readFileSync(chatbotDataFile));
}

module.exports = async (message, client) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const prefix = "!";
  const ownerId = "1363540480662704248";
  const isOwner = message.author.id === ownerId;

  let args, cmd;

  if (isOwner) {
    args = message.content.trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  } else {
    if (!message.content.startsWith(prefix)) return;
    args = message.content.slice(prefix.length).trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  }

  const command =
    client.commands.get(cmd) ||
    client.commands.get(client.aliases.get(cmd));

  if (command) {
    command.execute(message, args, client);
  }

  // ================= AUTOMOD =================
  if (automod.runAutomod) {
    automod.runAutomod(message);
  }

  // ================= CHATBOT SYSTEM =================
  const chatbotData = loadChatbot();
  const guildData = chatbotData[message.guild.id];

  if (!guildData) return;
  if (message.channel.id !== guildData.channel) return;

  // ignore bot messages
  if (message.author.bot) return;

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a friendly Discord chatbot." },
          { role: "user", content: message.content }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHATBOT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = res.data.choices[0].message.content;

    message.reply(reply);

  } catch (err) {
    console.log("Chatbot error:", err.message);
  }
};
