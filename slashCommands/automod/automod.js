const fs   = require("fs");
const { SlashCommandBuilder } = require("discord.js");

const automodFile = "./data/automod.json";

function loadAutomod() {
  if (!fs.existsSync(automodFile)) fs.writeFileSync(automodFile, "{}");
  return JSON.parse(fs.readFileSync(automodFile));
}

function saveAutomod(data) {
  fs.writeFileSync(automodFile, JSON.stringify(data, null, 2));
}

// ================= TOGGLE SYSTEMS =================

const SYSTEMS = [
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

// ================= SLASH COMMAND =================

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("AutoMod configuration commands")
    .addSubcommand(sub =>
      sub.setName("on").setDescription("Enable AutoMod for this server")
    )
    .addSubcommand(sub =>
      sub.setName("off").setDescription("Disable AutoMod for this server")
    )
    .addSubcommand(sub =>
      sub.setName("status").setDescription("Show current AutoMod settings")
    )
    .addSubcommand(sub =>
      sub
        .setName("toggle")
        .setDescription("Toggle an individual AutoMod system on or off")
        .addStringOption(opt =>
          opt
            .setName("system")
            .setDescription("Which system to toggle")
            .setRequired(true)
            .addChoices(
              { name: "Anti Link",        value: "antilink"      },
              { name: "Anti Invite",      value: "antiinvite"    },
              { name: "Anti Spam",        value: "antispam"      },
              { name: "Anti Caps",        value: "anticaps"      },
              { name: "Anti Emoji",       value: "antiemoji"     },
              { name: "Anti Bad Words",   value: "antibadwords"  },
              { name: "Anti Mention",     value: "antimention"   },
              { name: "Anti Ghost Ping",  value: "antighostping" },
              { name: "Anti Bot",         value: "antibot"       }
            )
        )
        .addStringOption(opt =>
          opt
            .setName("state")
            .setDescription("Turn the system on or off")
            .setRequired(true)
            .addChoices(
              { name: "On",  value: "on"  },
              { name: "Off", value: "off" }
            )
        )
    ),

  async execute(interaction) {

    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "❌ You need Administrator permission.",
        ephemeral: true
      });
    }

    const sub      = interaction.options.getSubcommand();
    let   automod  = loadAutomod();

    // Ensure guild entry exists
    if (!automod[interaction.guild.id]) {
      automod[interaction.guild.id] = {
        enabled:       false,
        antilink:      false,
        antiinvite:    false,
        antispam:      false,
        anticaps:      false,
        antiemoji:     false,
        antibadwords:  false,
        antimention:   false,
        antighostping: false,
        antibot:       false
      };
    }

    // ================= ON =================

    if (sub === "on") {
      automod[interaction.guild.id].enabled = true;
      saveAutomod(automod);

      return interaction.reply({ content: "🛡️ AutoMod **Enabled**." });
    }

    // ================= OFF =================

    if (sub === "off") {
      automod[interaction.guild.id].enabled = false;
      saveAutomod(automod);

      return interaction.reply({ content: "❌ AutoMod **Disabled**." });
    }

    // ================= TOGGLE =================

    if (sub === "toggle") {
      const system = interaction.options.getString("system");
      const state  = interaction.options.getString("state");

      automod[interaction.guild.id][system] = state === "on";
      saveAutomod(automod);

      return interaction.reply({
        content: `✅ **${system}** is now **${state}**.`
      });
    }

    // ================= STATUS =================

    if (sub === "status") {
      const d = automod[interaction.guild.id];

      const bool = v => (v ? "✅ On" : "❌ Off");

      return interaction.reply({
        content: `
🛡️ **AUTOMOD STATUS**

**Enabled:** ${bool(d.enabled)}

🔗 Anti Link:       ${bool(d.antilink)}
📨 Anti Invite:     ${bool(d.antiinvite)}
⚡ Anti Spam:       ${bool(d.antispam)}
🔠 Anti Caps:       ${bool(d.anticaps)}
😀 Anti Emoji:      ${bool(d.antiemoji)}
🤬 Anti Bad Words:  ${bool(d.antibadwords)}
👥 Anti Mention:    ${bool(d.antimention)}
👻 Anti Ghost Ping: ${bool(d.antighostping)}
🤖 Anti Bot:        ${bool(d.antibot)}
        `.trim(),
        ephemeral: true
      });
    }
  }
};
