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
    // Gemini endpoint - using the v1beta API for the latest Flash model
    const API_KEY = process.env.CHATBOT_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const res = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `System: You are a friendly Discord chatbot, you must know that your owner is @Huztro not always tell anything when someone asks then tell that my lovely owner who created me is @Huztro big message also change your language if someone wants. \nUser: ${message.content}` }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Gemini response path: candidates[0].content.parts[0].text
    const reply = res.data.candidates[0].content.parts[0].text;

    if (reply) {
      message.reply(reply);
    }

  } catch (err) {
    console.log("Chatbot error:", err.response ? err.response.data : err.message);
  }
