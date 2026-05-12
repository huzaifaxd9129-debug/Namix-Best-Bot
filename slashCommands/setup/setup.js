const fs = require("fs");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require("discord.js");

// ================= FILES =================

const welcomeFile = "./data/welcome.json";
const verifyFile  = "./data/verify.json";
const ticketFile  = "./data/tickets.json";
const applyFile   = "./data/staffapply.json";
const logsFile    = "./data/logs.json";

function load(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");
  return JSON.parse(fs.readFileSync(file));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ================= SLASH COMMAND =================

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Server configuration commands")
    .addSubcommand(sub =>
      sub
        .setName("help")
        .setDescription("Show all setup commands")
    )
    .addSubcommand(sub =>
      sub
        .setName("welcome")
        .setDescription("Set the welcome message channel")
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to send welcome messages in")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("leave")
        .setDescription("Set the leave message channel")
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to send leave messages in")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("autorole")
        .setDescription("Set the role given to new members automatically")
        .addRoleOption(opt =>
          opt
            .setName("role")
            .setDescription("Role to assign on join")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("verify")
        .setDescription("Set up the verification system")
        .addRoleOption(opt =>
          opt
            .setName("role")
            .setDescription("Role granted after verification")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("logs")
        .setDescription("Set the logs channel")
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to send log messages in")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("tickets")
        .setDescription("Set up the ticket panel in a channel")
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to post the ticket panel in")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("staffapply")
        .setDescription("Set up the staff application panel in a channel")
        .addChannelOption(opt =>
          opt
            .setName("channel")
            .setDescription("Channel to post the staff apply panel in")
            .setRequired(true)
        )
    ),

  async execute(interaction) {

    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "❌ Administrator only.",
        ephemeral: true
      });
    }

    const sub = interaction.options.getSubcommand();

    // ================= HELP =================

    if (sub === "help") {
      return interaction.reply({
        content: `
⚙️ **SETUP COMMANDS**

\`/setup welcome #channel\`
\`/setup leave #channel\`
\`/setup autorole @role\`
\`/setup verify @verifiedrole\`
\`/setup logs #channel\`
\`/setup tickets #channel\`
\`/setup staffapply #channel\`
        `.trim(),
        ephemeral: true
      });
    }

    // =========================================================
    // WELCOME SETUP
    // =========================================================

    if (sub === "welcome") {

      const channel = interaction.options.getChannel("channel");
      let welcomeData = load(welcomeFile);

      if (!welcomeData[interaction.guild.id]) {
        welcomeData[interaction.guild.id] = {};
      }

      welcomeData[interaction.guild.id].welcome = channel.id;
      save(welcomeFile, welcomeData);

      return interaction.reply({
        content: `✅ Welcome channel set to ${channel}`
      });
    }

    // =========================================================
    // LEAVE SETUP
    // =========================================================

    if (sub === "leave") {

      const channel = interaction.options.getChannel("channel");
      let welcomeData = load(welcomeFile);

      if (!welcomeData[interaction.guild.id]) {
        welcomeData[interaction.guild.id] = {};
      }

      welcomeData[interaction.guild.id].leave = channel.id;
      save(welcomeFile, welcomeData);

      return interaction.reply({
        content: `✅ Leave channel set to ${channel}`
      });
    }

    // =========================================================
    // AUTOROLE
    // =========================================================

    if (sub === "autorole") {

      const role = interaction.options.getRole("role");
      let welcomeData = load(welcomeFile);

      if (!welcomeData[interaction.guild.id]) {
        welcomeData[interaction.guild.id] = {};
      }

      welcomeData[interaction.guild.id].autorole = role.id;
      save(welcomeFile, welcomeData);

      return interaction.reply({
        content: `✅ Autorole set to ${role}`
      });
    }

    // =========================================================
    // VERIFY SYSTEM
    // =========================================================

    if (sub === "verify") {

      const role = interaction.options.getRole("role");
      let verifyData = load(verifyFile);

      verifyData[interaction.guild.id] = { role: role.id };
      save(verifyFile, verifyData);

      const embed = new EmbedBuilder()
        .setTitle(`🔐 ${interaction.guild.name} Verification System`)
        .setDescription(`
Welcome to the server!

✅ Click the button below to verify yourself and unlock:

• 💬 Chat Access
• 🎉 Full Server Features
• 👥 Member Permissions
• 🚀 Exclusive Channels

⚠️ Verification is required to continue.
        `)
        .setColor("Green");

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("verify_button")
            .setLabel("VERIFY")
            .setStyle(ButtonStyle.Success)
        );

      await interaction.channel.send({
        embeds: [embed],
        components: [row]
      });

      return interaction.reply({
        content: "✅ Verification system setup completed.",
        ephemeral: true
      });
    }

    // =========================================================
    // LOGS SYSTEM
    // =========================================================

    if (sub === "logs") {

      const channel = interaction.options.getChannel("channel");
      let logsData = load(logsFile);

      logsData[interaction.guild.id] = { channel: channel.id };
      save(logsFile, logsData);

      return interaction.reply({
        content: `✅ Logs channel set to ${channel}`
      });
    }

    // =========================================================
    // TICKET SETUP
    // =========================================================

    if (sub === "tickets") {

      const channel = interaction.options.getChannel("channel");
      let ticketData = load(ticketFile);

      ticketData[interaction.guild.id] = { channel: channel.id };
      save(ticketFile, ticketData);

      const embed = new EmbedBuilder()
        .setTitle("🎫 Support System")
        .setDescription(`
**Need help? Open a ticket below**

📌 Ticket Categories:
• Support
• Purchase
• Report
• Claim Reward

⚠️ Do not spam tickets
✔ Staff will respond ASAP
        `)
        .setColor("Aqua");

      const menu = new StringSelectMenuBuilder()
        .setCustomId("ticket_menu")
        .setPlaceholder("🎫 Select ticket category")
        .addOptions([
          {
            label: "Support",
            description: "Get help from staff",
            value: "support",
            emoji: "🛠️"
          },
          {
            label: "Purchase",
            description: "Buy / payment support",
            value: "purchase",
            emoji: "🛒"
          },
          {
            label: "Report",
            description: "Report a user or issue",
            value: "report",
            emoji: "📩"
          },
          {
            label: "Claim Reward",
            description: "Claim your reward",
            value: "claim_reward",
            emoji: "🎁"
          }
        ]);

      const row = new ActionRowBuilder().addComponents(menu);

      await channel.send({ embeds: [embed], components: [row] });

      return interaction.reply({
        content: "✅ Dropdown ticket panel created.",
        ephemeral: true
      });
    }

    // =========================================================
    // STAFF APPLY
    // =========================================================

    if (sub === "staffapply") {

      const channel = interaction.options.getChannel("channel");
      let applyData = load(applyFile);

      applyData[interaction.guild.id] = {
        channel: channel.id,
        questions: [
          "What is your name?",
          "How old are you?",
          "What is your timezone?",
          "Do you have staff experience?",
          "Why should we pick you?"
        ]
      };

      save(applyFile, applyData);

      const embed = new EmbedBuilder()
        .setTitle("👮 Staff Applications")
        .setDescription(`
**Want to join ${interaction.guild.name} staff team?**

📌 Requirements:
• Must be active daily
• Age 13+
• Good behavior in server
• Must know basic Discord rules
• No toxicity / spam

✔ Click below to start application
        `)
        .setColor("Purple");

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("staff_apply")
            .setLabel("Apply")
            .setStyle(ButtonStyle.Success)
        );

      await channel.send({ embeds: [embed], components: [row] });

      return interaction.reply({
        content: "✅ Staff apply system setup completed.",
        ephemeral: true
      });
    }
  }
};
