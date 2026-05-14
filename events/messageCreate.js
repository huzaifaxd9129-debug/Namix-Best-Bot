const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const automod = require("../commands/automod");

// ==================================================
// GEMINI AI
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

  return JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
}

function save(filePath, data) {

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );

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
// EVENT
// ==================================================

module.exports = async (message, client) => {

  if (!message.guild) return;
  if (message.author.bot) return;

  // ==================================================
  // PREFIX
  // ==================================================

  const prefix = "!";
  const ownerId = "1363540480662704248";

  let args;
  let cmd;

  if (message.author.id === ownerId) {

    args = message.content.trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();

  }

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

        return message.reply(
          "❌ Command error occurred."
        );

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
  // APPLICATION SYSTEM
  // ==================================================

  const applications = load(appFile);

  // ==================================================
  // CREATE APPLICATION
  // ==================================================

  if (cmd === "createapplication") {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {

      return message.reply(
        "❌ Admin only."
      );

    }

    const ask = async (question) => {

      const embed = new EmbedBuilder()

        .setColor("Blurple")

        .setTitle("📘 Application Creator")

        .setDescription(question);

      await message.channel.send({
        embeds: [embed]
      });

      const collected =
        await message.channel.awaitMessages({

          filter:
            m => m.author.id === message.author.id,

          max: 1,

          time: 120000

        });

      if (!collected.first()) return null;

      return collected.first().content;
    };

    const title =
      await ask("Application title?");

    if (!title) return;

    const description =
      await ask("Application description?");

    if (!description) return;

    const buttonName =
      await ask("Button name?");

    if (!buttonName) return;

    const questions = [];

    for (let i = 0; i < 5; i++) {

      const q =
        await ask(`Question ${i + 1}?`);

      if (!q) return;

      questions.push(q);
    }

    if (!applications[message.guild.id]) {
      applications[message.guild.id] = [];
    }

    const appId =
      applications[message.guild.id].length + 1;

    applications[message.guild.id].push({

      id: appId,

      title,
      description,
      buttonName,
      questions

    });

    save(appFile, applications);

    return message.reply(
      `✅ Application created with ID: ${appId}`
    );
  }

  // ==================================================
  // SEND APPLICATION
  // ==================================================

  if (cmd === "sendapplication") {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {

      return message.reply(
        "❌ Admin only."
      );

    }

    const id = parseInt(args[0]);

    const channel =
      message.mentions.channels.first();

    if (!id) {

      return message.reply(
        "❌ Give application ID."
      );

    }

    if (!channel) {

      return message.reply(
        "❌ Mention a channel."
      );

    }

    const data =
      applications[message.guild.id];

    if (!data || data.length === 0) {

      return message.reply(
        "❌ No applications found."
      );

    }

    const app =
      data.find(a => a.id === id);

    if (!app) {

      return message.reply(
        "❌ Invalid application ID."
      );

    }

    const embed = new EmbedBuilder()

      .setColor("Blurple")

      .setTitle(app.title)

      .setDescription(app.description);

    const row =
      new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()

            .setCustomId(`apply_${app.id}`)

            .setLabel(app.buttonName)

            .setStyle(ButtonStyle.Primary)

        );

    await channel.send({

      embeds: [embed],

      components: [row]

    });

    return message.reply(
      `✅ Application sent in ${channel}`
    );
  }

  // ==================================================
  // APPLICATION LIST
  // ==================================================

  if (cmd === "listapplications") {

    const data =
      applications[message.guild.id];

    if (!data || data.length === 0) {

      return message.reply(
        "❌ No applications found."
      );

    }

    const embed = new EmbedBuilder()

      .setColor("Blurple")

      .setTitle("📋 List Of Applications")

      .setDescription(

        data.map(app =>

`
🆔 ID: ${app.id}
📌 ${app.title}
`

        ).join("\n")

      );

    return message.channel.send({
      embeds: [embed]
    });
  }

  // ==================================================
  // DELETE APPLICATION
  // ==================================================

  if (cmd === "deleteapplication") {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {

      return message.reply(
        "❌ Admin only."
      );

    }

    const id = parseInt(args[0]);

    if (!id) {

      return message.reply(
        "❌ Give application ID."
      );

    }

    const data =
      applications[message.guild.id];

    if (!data) {

      return message.reply(
        "❌ No applications."
      );

    }

    const filtered =
      data.filter(a => a.id !== id);

    applications[message.guild.id] =
      filtered;

    save(appFile, applications);

    return message.reply(
      `✅ Deleted application ID ${id}`
    );
  }

  // ==================================================
  // AI CHATBOT
  // ==================================================

  const chatbot = load(chatbotFile);

  const guildData =
    chatbot[message.guild.id];

  if (!guildData) return;
  if (!guildData.enabled) return;

  if (
    message.channel.id !==
    guildData.channel
  ) return;

  if (
    message.content.startsWith(prefix)
  ) return;

  if (
    aiCooldown.has(message.author.id)
  ) return;

  aiCooldown.add(message.author.id);

  setTimeout(() => {

    aiCooldown.delete(
      message.author.id
    );

  }, 4000);

  try {

    await message.channel.sendTyping();

    const memory = load(memoryFile);

    if (!memory[message.author.id]) {

      memory[message.author.id] = [];

    }

    const history =
      memory[message.author.id]

        .map(m => ({

          role: m.role,

          parts: [
            {
              text: m.content
            }
          ]

        }));

    const result =
      await model.generateContent({

        contents: [

          {
            role: "user",

            parts: [
              {
                text:
                  "You are a smart Discord AI assistant."
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

    const response =
      await result.response;

    let text =
      response.text();

    if (text.length > 1900) {
      text = text.slice(0, 1900);
    }

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

    memory[message.author.id] =
      memory[message.author.id]
        .slice(-10);

    save(memoryFile, memory);

    return message.reply(text);

  } catch (err) {

    console.log("AI Error:", err);

    return message.reply(
      "❌ AI failed to respond."
    );

  }
};
