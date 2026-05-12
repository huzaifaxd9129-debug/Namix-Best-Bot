const fs = require("fs");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

// ================= FILES =================

const welcomeFile = "./data/welcome.json";
const verifyFile = "./data/verify.json";
const ticketFile = "./data/tickets.json";
const applyFile = "./data/staffapply.json";
const logsFile = "./data/logs.json";

function load(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "{}");
  }

  return JSON.parse(fs.readFileSync(file));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let welcomeData = load(welcomeFile);
let verifyData = load(verifyFile);
let ticketData = load(ticketFile);
let applyData = load(applyFile);
let logsData = load(logsFile);

// ================= MODULE =================

module.exports = {
  name: "setup",
  aliases: ["config"],

  async execute(message, args, client) {

    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Administrator only.");
    }

    const cmd = args[0];

    // ================= HELP =================

    if (!cmd || cmd === "help") {
      return message.channel.send(`
⚙️ SETUP COMMANDS

!setup welcome #channel
!setup leave #channel
!setup autorole @role

!setup verify @verifiedrole

!setup logs #channel

!setup tickets #channel

!setup staffapply #channel

Examples:
!setup welcome #welcome
!setup verify @Verified
!setup tickets #tickets
      `);
    }

    // =========================================================
    // WELCOME SETUP
    // =========================================================

    if (cmd === "welcome") {

      const channel = message.mentions.channels.first();

      if (!channel) {
        return message.reply("Mention a channel.");
      }

      if (!welcomeData[message.guild.id]) {
        welcomeData[message.guild.id] = {};
      }

      welcomeData[message.guild.id].welcome = channel.id;

      save(welcomeFile, welcomeData);

      return message.channel.send(
        `✅ Welcome channel set to ${channel}`
      );
    }

    // =========================================================
    // LEAVE SETUP
    // =========================================================

    if (cmd === "leave") {

      const channel = message.mentions.channels.first();

      if (!channel) {
        return message.reply("Mention a channel.");
      }

      if (!welcomeData[message.guild.id]) {
        welcomeData[message.guild.id] = {};
      }

      welcomeData[message.guild.id].leave = channel.id;

      save(welcomeFile, welcomeData);

      return message.channel.send(
        `✅ Leave channel set to ${channel}`
      );
    }

    // =========================================================
    // AUTOROLE
    // =========================================================

    if (cmd === "autorole") {

      const role = message.mentions.roles.first();

      if (!role) {
        return message.reply("Mention a role.");
      }

      if (!welcomeData[message.guild.id]) {
        welcomeData[message.guild.id] = {};
      }

      welcomeData[message.guild.id].autorole = role.id;

      save(welcomeFile, welcomeData);

      return message.channel.send(
        `✅ Autorole set to ${role}`
      );
    }

    // =========================================================
    // VERIFY SYSTEM
    // =========================================================

    if (cmd === "verify") {

      const role = message.mentions.roles.first();

      if (!role) {
        return message.reply("Mention verified role.");
      }

      verifyData[message.guild.id] = {
        role: role.id
      };

      save(verifyFile, verifyData);

      const embed = new EmbedBuilder()
        .setTitle("🔐 ${message.guild.name} Verification System")
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

      await message.channel.send({
        embeds: [embed],
        components: [row]
      });

      return message.channel.send(
        "✅ Verification system setup completed."
      );
    }

    // =========================================================
    // LOGS SYSTEM
    // =========================================================

    if (cmd === "logs") {

      const channel = message.mentions.channels.first();

      if (!channel) {
        return message.reply("Mention a logs channel.");
      }

      logsData[message.guild.id] = {
        channel: channel.id
      };

      save(logsFile, logsData);

      return message.channel.send(
        `✅ Logs channel set to ${channel}`
      );
    }

    // =========================================================
    // TICKET SETUP
    // =========================================================

if (cmd === "tickets") {

const channel =
  message.mentions.channels.first() ||
  message.guild.channels.cache.get(args[1]) ||
  message.guild.channels.cache.find(
    c => c.name === args[1]
  );

if (!channel) {
  return message.reply("❌ Mention a valid channel or give channel ID/name.");
}

  ticketData[message.guild.id] = {
    channel: channel.id
  };

  save(ticketFile, ticketData);

  const embed = new EmbedBuilder()
    .setTitle('🎫 Support System')
    .setDescription(`
**Need help? Open a ticket below**

📌 Ticket Categorys:
• Support
• Purchase
• Report
• Claim Reward

⚠️ Do not spam tickets
✔ Staff will respond ASAP
    `)
    .setColor("Aqua");

  // ================= DROPDOWN MENU =================

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

  await channel.send({
    embeds: [embed],
    components: [row]
  });

  return message.channel.send("✅ Dropdown ticket panel created.");
}

    // =========================================================
    // STAFF APPLY
    // =========================================================

    if (cmd === "staffapply") {

      const channel = message.mentions.channels.first();

      if (!channel) {
        return message.reply("Mention a channel.");
      }

      applyData[message.guild.id] = {
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
**Want to join ${message.guild.name} staff team?**

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

      await channel.send({
        embeds: [embed],
        components: [row]
      });

      return message.channel.send(
        "✅ Staff apply system setup completed."
      );
    }

  }
};

// =========================================================
// STAFF APPLY BUTTON EVENT
// =========================================================

module.exports.staffApplyButton = async (interaction) => {

  if (interaction.customId !== "staff_apply") return;

  const data = applyData[interaction.guild.id];

  if (!data) {
    return interaction.reply({
      content: "❌ Staff apply system not setup.",
      ephemeral: true
    });
  }

  const modal = new ModalBuilder()
    .setCustomId("staff_apply_modal")
    .setTitle("📋 Staff Application");

  const q1 = new TextInputBuilder()
    .setCustomId("apply_name")
    .setLabel("What is your name?")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const q2 = new TextInputBuilder()
    .setCustomId("apply_age")
    .setLabel("How old are you?")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const q3 = new TextInputBuilder()
    .setCustomId("apply_timezone")
    .setLabel("What is your timezone?")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const q4 = new TextInputBuilder()
    .setCustomId("apply_experience")
    .setLabel("Do you have staff experience?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const q5 = new TextInputBuilder()
    .setCustomId("apply_why")
    .setLabel("Why should we pick you?")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(q1),
    new ActionRowBuilder().addComponents(q2),
    new ActionRowBuilder().addComponents(q3),
    new ActionRowBuilder().addComponents(q4),
    new ActionRowBuilder().addComponents(q5)
  );

  await interaction.showModal(modal);
};

// =========================================================
// STAFF APPLY MODAL SUBMISSION
// =========================================================

module.exports.staffApplyModal = async (interaction, client) => {

  if (interaction.customId !== "staff_apply_modal") return;

  const data = applyData[interaction.guild.id];
  const logsConfig = logsData[interaction.guild.id];

  const name       = interaction.fields.getTextInputValue("apply_name");
  const age        = interaction.fields.getTextInputValue("apply_age");
  const timezone   = interaction.fields.getTextInputValue("apply_timezone");
  const experience = interaction.fields.getTextInputValue("apply_experience");
  const why        = interaction.fields.getTextInputValue("apply_why");

  if (logsConfig && logsConfig.channel) {

    const logsChannel =
      interaction.guild.channels.cache.get(logsConfig.channel);

    if (logsChannel) {

      const embed = new EmbedBuilder()
        .setTitle("📋 New Staff Application")
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setColor("Purple")
        .addFields(
          {
            name: "👤 Applicant",
            value: `${interaction.user} (${interaction.user.tag})\nID: ${interaction.user.id}`
          },
          { name: "📛 Name",               value: name,       inline: true },
          { name: "🎂 Age",                value: age,        inline: true },
          { name: "🌍 Timezone",           value: timezone,   inline: true },
          { name: "🛡️ Staff Experience",   value: experience },
          { name: "💡 Why should we pick you?", value: why }
        )
        .setTimestamp();

      await logsChannel.send({ embeds: [embed] });
    }
  }

  await interaction.reply({
    content: "✅ Your staff application has been submitted! We will review it shortly.",
    ephemeral: true
  });
};

// =========================================================
// VERIFY BUTTON EVENT
// =========================================================

module.exports.verifyButton = async (interaction) => {

  if (interaction.customId !== "verify_button") return;

  const data = verifyData[interaction.guild.id];

  if (!data) {
    return interaction.reply({
      content: "❌ Verify system not setup.",
      ephemeral: true
    });
  }

  const role = interaction.guild.roles.cache.get(data.role);

  if (!role) {
    return interaction.reply({
      content: "❌ Verified role missing.",
      ephemeral: true
    });
  }

  await interaction.member.roles.add(role);

  interaction.reply({
    content: "✅ You are now verified.",
    ephemeral: true
  });
};

// =========================================================
// WELCOME EVENT
// =========================================================

module.exports.memberJoin = async (member) => {

  const data = welcomeData[member.guild.id];

  if (!data) return;

  // ================= WELCOME =================

  if (data.welcome) {

    const channel =
      member.guild.channels.cache.get(data.welcome);

    if (channel) {

      const embed = new EmbedBuilder()
        .setTitle("👋 Welcome")
        .setDescription(`
Welcome ${member}

You are our #${member.guild.memberCount} member
        `)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor("Green");

      channel.send({
        embeds: [embed]
      });
    }
  }

  // ================= AUTOROLE =================

  if (data.autorole) {

    const role =
      member.guild.roles.cache.get(data.autorole);

    if (role) {
      member.roles.add(role).catch(() => {});
    }
  }
};

// =========================================================
// MEMBER LEAVE
// =========================================================

module.exports.memberLeave = async (member) => {

  const data = welcomeData[member.guild.id];

  if (!data) return;

  if (data.leave) {

    const channel =
      member.guild.channels.cache.get(data.leave);

    if (!channel) return;

    channel.send(
      `😢 ${member.user.tag} left the server`
    );
  }
};
