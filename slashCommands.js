const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

// ================= AUTOMOD FILE =================

const automodFile = "./data/automod.json";

if (!fs.existsSync(automodFile)) {
  fs.writeFileSync(automodFile, "{}");
}

let automod = require("../data/automod.json");

// ================= SAVE =================

function save() {
  fs.writeFileSync(automodFile, JSON.stringify(automod, null, 2));
}

// =====================================================
// 20+ MODERATION SLASH COMMANDS
// =====================================================

module.exports = [

  // ================= PING =================
  {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Bot latency"),

    async execute(interaction) {
      await interaction.reply(`🏓 ${interaction.client.ws.ping}ms`);
    }
  },

  // ================= BAN =================
  {
    data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Ban user")
      .addUserOption(o =>
        o.setName("user").setRequired(true)
      )
      .addStringOption(o =>
        o.setName("reason")
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason") || "No reason";

      const member = await interaction.guild.members.fetch(user.id);
      await member.ban({ reason });

      await interaction.reply(`🔨 Banned ${user.tag}`);
    }
  },

  // ================= KICK =================
  {
    data: new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Kick user")
      .addUserOption(o => o.setName("user").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const member = await interaction.guild.members.fetch(user.id);

      await member.kick();
      await interaction.reply(`👢 Kicked ${user.tag}`);
    }
  },

  // ================= TIMEOUT =================
  {
    data: new SlashCommandBuilder()
      .setName("timeout")
      .setDescription("Timeout user")
      .addUserOption(o => o.setName("user").setRequired(true))
      .addIntegerOption(o => o.setName("time").setRequired(true)),

    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const time = interaction.options.getInteger("time");

      const member = await interaction.guild.members.fetch(user.id);

      await member.timeout(time * 1000);
      await interaction.reply(`⏰ Timed out ${user.tag}`);
    }
  },

  // ================= UNTIMEOUT =================
  {
    data: new SlashCommandBuilder()
      .setName("untimeout")
      .setDescription("Remove timeout")
      .addUserOption(o => o.setName("user").setRequired(true)),

    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const member = await interaction.guild.members.fetch(user.id);

      await member.timeout(null);
      await interaction.reply(`✅ Timeout removed`);
    }
  },

  // ================= CLEAR =================
  {
    data: new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Delete messages")
      .addIntegerOption(o =>
        o.setName("amount").setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
      const amount = interaction.options.getInteger("amount");

      await interaction.channel.bulkDelete(amount);

      await interaction.reply({
        content: `🧹 Deleted ${amount} messages`,
        ephemeral: true
      });
    }
  },

  // ================= LOCK =================
  {
    data: new SlashCommandBuilder()
      .setName("lock")
      .setDescription("Lock channel")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { SendMessages: false }
      );

      await interaction.reply("🔒 Locked");
    }
  },

  // ================= UNLOCK =================
  {
    data: new SlashCommandBuilder()
      .setName("unlock")
      .setDescription("Unlock channel"),

    async execute(interaction) {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { SendMessages: true }
      );

      await interaction.reply("🔓 Unlocked");
    }
  },

  // ================= NICK =================
  {
    data: new SlashCommandBuilder()
      .setName("nick")
      .setDescription("Change nickname")
      .addUserOption(o => o.setName("user").setRequired(true))
      .addStringOption(o => o.setName("name").setRequired(true)),

    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const name = interaction.options.getString("name");

      const member = await interaction.guild.members.fetch(user.id);

      await member.setNickname(name);

      await interaction.reply(`✏️ Nick changed`);
    }
  },

  // ================= SAY =================
  {
    data: new SlashCommandBuilder()
      .setName("say")
      .setDescription("Say message")
      .addStringOption(o => o.setName("text").setRequired(true)),

    async execute(interaction) {
      const text = interaction.options.getString("text");

      await interaction.reply({ content: text });
    }
  },

  // ================= EMBED =================
  {
    data: new SlashCommandBuilder()
      .setName("embed")
      .setDescription("Send embed")
      .addStringOption(o => o.setName("text").setRequired(true)),

    async execute(interaction) {
      const { EmbedBuilder } = require("discord.js");

      const text = interaction.options.getString("text");

      const embed = new EmbedBuilder()
        .setDescription(text)
        .setColor("Blue");

      await interaction.reply({ embeds: [embed] });
    }
  },

  // ================= AUTOMOD TOGGLE =================
  {
    data: new SlashCommandBuilder()
      .setName("automod")
      .setDescription("Toggle automod")
      .addStringOption(o =>
        o.setName("mode")
          .setRequired(true)
          .addChoices(
            { name: "on", value: "on" },
            { name: "off", value: "off" }
          )
      ),

    async execute(interaction) {
      const mode = interaction.options.getString("mode");

      if (!automod[interaction.guild.id]) {
        automod[interaction.guild.id] = { enabled: false };
      }

      automod[interaction.guild.id].enabled = mode === "on";

      save();

      await interaction.reply(`🛡️ Automod ${mode}`);
    }
  }

];
