const fs = require("fs");

const automodFile = "./data/automod.json";

if (!fs.existsSync(automodFile)) {
  fs.writeFileSync(automodFile, "{}");
}

let automod = require("../data/automod.json");

module.exports = {
  name: "automod",
  aliases: ["am"],

  async execute(message, args, client) {

    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You need Administrator permission.");
    }

    const cmd = args[0];

    // ================= HELP =================

    if (!cmd || cmd === "help") {
      return message.channel.send(`
🛡️ AUTOMOD COMMANDS

!automod on
!automod off

!automod antilink on/off
!automod antiinvite on/off
!automod antispam on/off
!automod anticaps on/off
!automod antiemoji on/off
!automod antibadwords on/off
!automod antimention on/off
!automod antighostping on/off
!automod antibot on/off

Example:
!automod antilink on
      `);
    }

    // ================= CREATE GUILD DATA =================

    if (!automod[message.guild.id]) {
      automod[message.guild.id] = {
        enabled: false,
        antilink: false,
        antiinvite: false,
        antispam: false,
        anticaps: false,
        antiemoji: false,
        antibadwords: false,
        antimention: false,
        antighostping: false,
        antibot: false
      };
    }

    // ================= MAIN ON/OFF =================

    if (cmd === "on") {

      automod[message.guild.id].enabled = true;

      saveData();

      return message.channel.send("🛡️ AutoMod Enabled");
    }

    if (cmd === "off") {

      automod[message.guild.id].enabled = false;

      saveData();

      return message.channel.send("❌ AutoMod Disabled");
    }

    // ================= TOGGLES =================

    const systems = [
      "antilink",
      "antiinvite",
      "antispam",
      "anticaps",
      "antiemoji",
      "antibadwords",
      "antimention",
      "antighostping",
      "antibot"
    ];

    if (systems.includes(cmd)) {

      const state = args[1];

      if (!["on", "off"].includes(state)) {
        return message.reply("Use on/off");
      }

      automod[message.guild.id][cmd] = state === "on";

      saveData();

      return message.channel.send(
        `✅ ${cmd} is now ${state}`
      );
    }

    // ================= STATUS =================

    if (cmd === "status") {

      const data = automod[message.guild.id];

      return message.channel.send(`
🛡️ AUTOMOD STATUS

Enabled: ${data.enabled}

🔗 Anti Link: ${data.antilink}
📨 Anti Invite: ${data.antiinvite}
⚡ Anti Spam: ${data.antispam}
🔠 Anti Caps: ${data.anticaps}
😀 Anti Emoji: ${data.antiemoji}
🤬 Anti BadWords: ${data.antibadwords}
👥 Anti Mention: ${data.antimention}
👻 Anti Ghost Ping: ${data.antighostping}
🤖 Anti Bot: ${data.antibot}
      `);
    }

  }
};

// ================= SAVE =================

function saveData() {
  fs.writeFileSync(
    automodFile,
    JSON.stringify(automod, null, 2)
  );
}

// ================= AUTOMOD MESSAGE EVENT =================

module.exports.runAutomod = async (message) => {

  if (!message.guild) return;
  if (message.author.bot) return;

  const data = automod[message.guild.id];

  if (!data) return;
  if (!data.enabled) return;

  // ================= IGNORE ADMINS =================

  if (message.member.permissions.has("Administrator")) return;

  // ================= ANTI LINK =================

  if (data.antilink) {

    const linkRegex =
      /(https?:\/\/|www\.)/gi;

    if (linkRegex.test(message.content)) {

      await message.delete().catch(() => {});

      return message.channel.send(
        `❌ ${message.author} Links are not allowed`
      );
    }
  }

  // ================= ANTI INVITE =================

  if (data.antiinvite) {

    if (
      message.content.includes("discord.gg") ||
      message.content.includes("discord.com/invite")
    ) {

      await message.delete().catch(() => {});

      return message.channel.send(
        `❌ ${message.author} Invite links are not allowed`
      );
    }
  }

  // ================= ANTI CAPS =================

  if (data.anticaps) {

    if (message.content.length > 8) {

      const caps =
        message.content.replace(/[^A-Z]/g, "").length;

      const percent =
        caps / message.content.length;

      if (percent > 0.7) {

        await message.delete().catch(() => {});

        return message.channel.send(
          `❌ ${message.author} Too many caps`
        );
      }
    }
  }

  // ================= ANTI EMOJI =================

  if (data.antiemoji) {

    const emojis =
      message.content.match(/[\p{Emoji}]/gu);

    if (emojis && emojis.length > 10) {

      await message.delete().catch(() => {});

      return message.channel.send(
        `❌ ${message.author} Too many emojis`
      );
    }
  }

  // ================= ANTI MENTION =================

  if (data.antimention) {

    if (message.mentions.users.size > 5) {

      await message.delete().catch(() => {});

      return message.channel.send(
        `❌ ${message.author} Too many mentions`
      );
    }
  }

  // ================= BAD WORDS =================

  if (data.antibadwords) {

    const badwords = [
      "fuck",
      "bitch",
      "asshole",
      "nigga",
      "porn",
      "sex"
    ];

    const found = badwords.some(word =>
      message.content.toLowerCase().includes(word)
    );

    if (found) {

      await message.delete().catch(() => {});

      return message.channel.send(
        `❌ ${message.author} Bad words are not allowed`
      );
    }
  }

};

// ================= MEMBER JOIN EVENT =================

module.exports.runMemberJoin = async (member) => {

  const data = automod[member.guild.id];

  if (!data) return;
  if (!data.enabled) return;

  // ================= ANTI BOT =================

  if (data.antibot) {

    if (member.user.bot) {

      await member.kick("AntiBot Enabled");

      console.log(
        `🤖 Bot kicked: ${member.user.tag}`
      );
    }
  }

};
