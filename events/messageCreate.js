const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const automod = require("../commands/automod");

// ==================================================
// GEMINI AI SETUP
// ==================================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// ==================================================
// FILE SYSTEM
// ==================================================

function load(filePath) {

  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "{}");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function save(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ==================================================
// FILES
// ==================================================

const chatbotFile = "./data/chatbot.json";
const memoryFile = "./data/memory.json";
const appFile = "./data/applications.json";

// ==================================================
// COOLDOWNS
// ==================================================

const aiCooldown = new Set();

// ==================================================
// EXPORT EVENT
// ==================================================

module.exports = async (message, client) => {

  if (!message.guild) return;
  if (message.author.bot) return;

  // ==================================================
  // PREFIX SYSTEM
  // ==================================================

  const prefix = "!";
  const ownerId = "1363540480662704248";

  let args;
  let cmd;

  // OWNER NO PREFIX
  if (message.author.id === ownerId) {

    args = message.content.trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();

  }

  // NORMAL PREFIX
  else if (message.content.startsWith(prefix)) {

    args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);

    cmd = args.shift()?.toLowerCase();
  }

  // ==================================================
  // COMMAND HANDLER
  // ==================================================

  if (cmd) {

    const command =
      client.commands.get(cmd) ||
      client.commands.get(client.aliases.get(cmd));

    if (command) {

      try {

        return command.execute(message, args, client);

      } catch (err) {

        console.log(err);

        return message.reply("❌ Command error occurred.");

      }
    }
  }

  // ==================================================
  // AUTOMOD
  // ==================================================

  try {

    if (automod.runAutomod) {
      automod.runAutomod(message);
    }

  } catch (err) {

    console.log("Automod Error:", err);

  }

  // ==================================================
  // STAFF APPLICATION SYSTEM
  // ==================================================

  const applications = load(appFile);

  if (cmd === "createapplication") {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply("❌ Admin only.");
    }

    const ask = async (question) => {

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("📘 Application Creator")
        .setDescription(question);

      await message.channel.send({
        embeds: [embed]
      });

      const collected = await message.channel.awaitMessages({
        filter: m => m.author.id === message.author.id,
        max: 1,
        time: 120000
      });

      if (!collected.first()) return null;

      const answer = collected.first().content;

      if (answer.toLowerCase() === "cancel") {
        return null;
      }

      return answer;
    };

    // TITLE
    const title = await ask(
      "Reply with application title."
    );

    if (!title) {
      return message.reply("❌ Cancelled.");
    }

    // DESCRIPTION
    const description = await ask(
      "Reply with application description."
    );

    if (!description) {
      return message.reply("❌ Cancelled.");
    }

    // BUTTON NAME
    const buttonName = await ask(
      "Reply with button name."
    );

    if (!buttonName) {
      return message.reply("❌ Cancelled.");
    }

    // CHANNEL
    const channelMsg = await ask(
      "Mention the application channel."
    );

    if (!channelMsg) {
      return message.reply("❌ Cancelled.");
    }

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(
        channelMsg.replace(/[<#>]/g, "")
      );

    if (!channel) {
      return message.reply("❌ Invalid channel.");
    }

    // QUESTIONS
    const questions = [];

    for (let i = 0; i < 5; i++) {

      const q = await ask(
        `Question ${i + 1}?`
      );

      if (!q) {
        return message.reply("❌ Cancelled.");
      }

      questions.push(q);
    }

    // SAVE
    applications[message.guild.id] = {
      title,
      description,
      buttonName,
      questions,
      channel: channel.id
    };

    save(appFile, applications);

    // PANEL
    const panel = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(title)
      .setDescription(description)
      .setFooter({
        text: `${message.guild.name} Applications`
      });

    const row = {
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          custom_id: "apply_btn",
          label: buttonName
        }
      ]
    };

    await channel.send({
      embeds: [panel],
      components: [row]
    });

    return message.reply(
      "✅ Application panel created."
    );
  }

  // ==================================================
  // AI CHATBOT SYSTEM
  // ==================================================

  const chatbot = load(chatbotFile);

  const guildData = chatbot[message.guild.id];

  if (!guildData) return;
  if (!guildData.enabled) return;

  // ONLY IN CHATBOT CHANNEL
  if (message.channel.id !== guildData.channel) return;

  // IGNORE COMMANDS
  if (message.content.startsWith(prefix)) return;

  // COOLDOWN
  if (aiCooldown.has(message.author.id)) return;

  aiCooldown.add(message.author.id);

  setTimeout(() => {
    aiCooldown.delete(message.author.id);
  }, 4000);

  // ==================================================
  // AI RESPONSE
  // ==================================================

  try {

    await message.channel.sendTyping();

    const memory = load(memoryFile);

    if (!memory[message.author.id]) {
      memory[message.author.id] = [];
    }

    const history = memory[message.author.id]
      .map(m => ({
        role: m.role,
        parts: [
          {
            text: m.content
          }
        ]
      }));

    const result = await model.generateContent({

      contents: [

        {
          role: "user",
          parts: [
            {
              text:
                "You are a smart Discord AI assistant. Keep replies short, friendly, and helpful."
            }
          ]
        },

        ...history,

        {
          role: "user",
          parts: [
            {
              text: message.content
            }
          ]
        }

      ]

    });

    const response = await result.response;

    let text = response.text();

    // LIMIT RESPONSE
    if (text.length > 1900) {
      text = text.slice(0, 1900);
    }

    // SAVE MEMORY
    memory[message.author.id].push(

      {
        role: "user",
        content: message.content
      },

      {
        role: "model",
        content: text
      }

    );

    // LAST 10 MSGS
    memory[message.author.id] =
      memory[message.author.id].slice(-10);

    save(memoryFile, memory);

    return message.reply(text);

  } catch (err) {

    console.log("AI Error:", err);

    return message.reply(
      "❌ AI failed to respond."
    );

  }
};
