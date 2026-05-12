const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("Moderation commands")

    // ── Member subcommands ──────────────────────────────────
    .addSubcommand(sub =>
      sub
        .setName("ban")
        .setDescription("Ban a member from the server")
        .addUserOption(opt =>
          opt.setName("user").setDescription("User to ban").setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName("reason").setDescription("Reason for the ban")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("unban")
        .setDescription("Unban a user by ID")
        .addStringOption(opt =>
          opt.setName("id").setDescription("User ID to unban").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("kick")
        .setDescription("Kick a member from the server")
        .addUserOption(opt =>
          opt.setName("user").setDescription("User to kick").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("timeout")
        .setDescription("Timeout a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("User to timeout").setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName("duration")
            .setDescription("Duration (e.g. 10m, 1h, 1d)")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("untimeout")
        .setDescription("Remove a timeout from a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("User to untimeout").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("warn")
        .setDescription("Warn a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("User to warn").setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName("reason").setDescription("Reason for the warning")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("nick")
        .setDescription("Change a member's nickname")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName("nickname").setDescription("New nickname").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("resetnick")
        .setDescription("Reset a member's nickname")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
    )

    // ── Message subcommands ─────────────────────────────────
    .addSubcommand(sub =>
      sub
        .setName("clear")
        .setDescription("Bulk-delete messages in the current channel")
        .addIntegerOption(opt =>
          opt
            .setName("amount")
            .setDescription("Number of messages to delete (1–100)")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
    )

    // ── Channel subcommands ─────────────────────────────────
    .addSubcommand(sub =>
      sub.setName("lock").setDescription("Lock the current channel")
    )
    .addSubcommand(sub =>
      sub.setName("unlock").setDescription("Unlock the current channel")
    )
    .addSubcommand(sub =>
      sub.setName("hide").setDescription("Hide the current channel from everyone")
    )
    .addSubcommand(sub =>
      sub.setName("unhide").setDescription("Make the current channel visible again")
    )
    .addSubcommand(sub =>
      sub
        .setName("slowmode")
        .setDescription("Set slowmode on the current channel")
        .addIntegerOption(opt =>
          opt
            .setName("seconds")
            .setDescription("Slowmode delay in seconds (0 to disable)")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(21600)
        )
    )
    .addSubcommand(sub =>
      sub.setName("nuke").setDescription("Clone and delete the current channel")
    )
    .addSubcommand(sub =>
      sub
        .setName("createchannel")
        .setDescription("Create a new text channel")
        .addStringOption(opt =>
          opt.setName("name").setDescription("Channel name").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName("deletechannel").setDescription("Delete the current channel")
    )
    .addSubcommand(sub =>
      sub
        .setName("renamechannel")
        .setDescription("Rename the current channel")
        .addStringOption(opt =>
          opt.setName("name").setDescription("New channel name").setRequired(true)
        )
    )

    // ── Role subcommands ────────────────────────────────────
    .addSubcommand(sub =>
      sub
        .setName("role")
        .setDescription("Add a role to a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
        .addRoleOption(opt =>
          opt.setName("role").setDescription("Role to add").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("unrole")
        .setDescription("Remove a role from a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
        .addRoleOption(opt =>
          opt.setName("role").setDescription("Role to remove").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("roleall")
        .setDescription("Add a role to every member")
        .addRoleOption(opt =>
          opt.setName("role").setDescription("Role to add").setRequired(true)
        )
    )

    // ── Voice subcommands ───────────────────────────────────
    .addSubcommand(sub =>
      sub
        .setName("disconnect")
        .setDescription("Disconnect a member from voice")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("deafen")
        .setDescription("Server-deafen a member in voice")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("undeafen")
        .setDescription("Remove server-deafen from a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("mutevc")
        .setDescription("Server-mute a member in voice")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("unmutevc")
        .setDescription("Remove server-mute from a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
    )

    // ── Utility subcommands ─────────────────────────────────
    .addSubcommand(sub =>
      sub
        .setName("say")
        .setDescription("Make the bot send a message")
        .addStringOption(opt =>
          opt.setName("text").setDescription("Message to send").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("embed")
        .setDescription("Send a message as an embed")
        .addStringOption(opt =>
          opt.setName("text").setDescription("Embed description").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("poll")
        .setDescription("Create a 👍/👎 poll")
        .addStringOption(opt =>
          opt.setName("question").setDescription("Poll question").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("announce")
        .setDescription("Send an announcement message")
        .addStringOption(opt =>
          opt.setName("text").setDescription("Announcement text").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("dm")
        .setDescription("Send a DM to a member")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user").setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName("text").setDescription("Message to send").setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("avatar")
        .setDescription("Show a user's avatar")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user (defaults to you)")
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("userinfo")
        .setDescription("Show info about a user")
        .addUserOption(opt =>
          opt.setName("user").setDescription("Target user (defaults to you)")
        )
    )
    .addSubcommand(sub =>
      sub.setName("serverinfo").setDescription("Show info about this server")
    )
    .addSubcommand(sub =>
      sub.setName("ping").setDescription("Show the bot's WebSocket latency")
    ),

  async execute(interaction) {

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageGuild
      )
    ) {
      return interaction.reply({
        content: "❌ You do not have permission.",
        ephemeral: true
      });
    }

    const sub    = interaction.options.getSubcommand();
    const client = interaction.client;

    // ================= BAN =================

    if (sub === "ban") {
      const member = interaction.options.getMember("user");
      const reason = interaction.options.getString("reason") || "No reason";

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.ban({ reason });

      return interaction.reply({
        content: `🔨 Banned **${member.user.tag}** — ${reason}`
      });
    }

    // ================= UNBAN =================

    if (sub === "unban") {
      const id = interaction.options.getString("id");

      await interaction.guild.members.unban(id).catch(() => {});

      return interaction.reply({ content: "✅ User unbanned." });
    }

    // ================= KICK =================

    if (sub === "kick") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.kick();

      return interaction.reply({
        content: `👢 Kicked **${member.user.tag}**`
      });
    }

    // ================= TIMEOUT =================

    if (sub === "timeout") {
      const member   = interaction.options.getMember("user");
      const duration = interaction.options.getString("duration");
      const ms       = require("ms");
      const time     = ms(duration);

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      if (!time) {
        return interaction.reply({
          content: "❌ Invalid duration. Use formats like `10m`, `1h`, `1d`.",
          ephemeral: true
        });
      }

      await member.timeout(time);

      return interaction.reply({
        content: `⏰ Timed out **${member.user.tag}** for ${duration}`
      });
    }

    // ================= UNTIMEOUT =================

    if (sub === "untimeout") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.timeout(null);

      return interaction.reply({ content: "✅ Timeout removed." });
    }

    // ================= WARN =================

    if (sub === "warn") {
      const member = interaction.options.getMember("user");
      const reason = interaction.options.getString("reason") || "No reason";

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      return interaction.reply({
        content: `⚠️ **${member.user.tag}** has been warned — ${reason}`
      });
    }

    // ================= NICK =================

    if (sub === "nick") {
      const member   = interaction.options.getMember("user");
      const nickname = interaction.options.getString("nickname");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.setNickname(nickname);

      return interaction.reply({ content: "✅ Nickname changed." });
    }

    // ================= RESETNICK =================

    if (sub === "resetnick") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.setNickname(null);

      return interaction.reply({ content: "✅ Nickname reset." });
    }

    // ================= CLEAR =================

    if (sub === "clear") {
      const amount = interaction.options.getInteger("amount");

      await interaction.channel.bulkDelete(amount, true);

      return interaction.reply({
        content: `🧹 Deleted **${amount}** messages.`,
        ephemeral: true
      });
    }

    // ================= LOCK =================

    if (sub === "lock") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { SendMessages: false }
      );

      return interaction.reply({ content: "🔒 Channel locked." });
    }

    // ================= UNLOCK =================

    if (sub === "unlock") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { SendMessages: true }
      );

      return interaction.reply({ content: "🔓 Channel unlocked." });
    }

    // ================= HIDE =================

    if (sub === "hide") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { ViewChannel: false }
      );

      return interaction.reply({ content: "🙈 Channel hidden." });
    }

    // ================= UNHIDE =================

    if (sub === "unhide") {
      await interaction.channel.permissionOverwrites.edit(
        interaction.guild.roles.everyone,
        { ViewChannel: true }
      );

      return interaction.reply({ content: "👀 Channel visible." });
    }

    // ================= SLOWMODE =================

    if (sub === "slowmode") {
      const seconds = interaction.options.getInteger("seconds");

      await interaction.channel.setRateLimitPerUser(seconds);

      return interaction.reply({
        content: `🐢 Slowmode set to **${seconds}s**.`
      });
    }

    // ================= NUKE =================

    if (sub === "nuke") {
      await interaction.reply({ content: "💥 Nuking channel..." });

      const cloned = await interaction.channel.clone();
      await interaction.channel.delete();

      cloned.send("💥 Channel nuked.");
    }

    // ================= CREATECHANNEL =================

    if (sub === "createchannel") {
      const name = interaction.options.getString("name").replace(/ /g, "-");

      await interaction.guild.channels.create({
        name,
        type: ChannelType.GuildText
      });

      return interaction.reply({ content: "✅ Channel created." });
    }

    // ================= DELETECHANNEL =================

    if (sub === "deletechannel") {
      await interaction.reply({ content: "🗑️ Deleting channel..." });
      await interaction.channel.delete();
    }

    // ================= RENAMECHANNEL =================

    if (sub === "renamechannel") {
      const name = interaction.options.getString("name").replace(/ /g, "-");

      await interaction.channel.setName(name);

      return interaction.reply({ content: `✅ Channel renamed to **${name}**.` });
    }

    // ================= ROLE =================

    if (sub === "role") {
      const member = interaction.options.getMember("user");
      const role   = interaction.options.getRole("role");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.roles.add(role);

      return interaction.reply({ content: `✅ Added ${role} to ${member}.` });
    }

    // ================= UNROLE =================

    if (sub === "unrole") {
      const member = interaction.options.getMember("user");
      const role   = interaction.options.getRole("role");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.roles.remove(role);

      return interaction.reply({ content: `✅ Removed ${role} from ${member}.` });
    }

    // ================= ROLEALL =================

    if (sub === "roleall") {
      const role = interaction.options.getRole("role");

      interaction.guild.members.cache.forEach(m => {
        m.roles.add(role).catch(() => {});
      });

      return interaction.reply({ content: "✅ Role added to all members." });
    }

    // ================= DISCONNECT =================

    if (sub === "disconnect") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.voice.disconnect();

      return interaction.reply({ content: "🔌 User disconnected from voice." });
    }

    // ================= DEAFEN =================

    if (sub === "deafen") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.voice.setDeaf(true);

      return interaction.reply({ content: "🔇 User server-deafened." });
    }

    // ================= UNDEAFEN =================

    if (sub === "undeafen") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.voice.setDeaf(false);

      return interaction.reply({ content: "🔊 Server-deafen removed." });
    }

    // ================= MUTEVC =================

    if (sub === "mutevc") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.voice.setMute(true);

      return interaction.reply({ content: "🔇 User server-muted in voice." });
    }

    // ================= UNMUTEVC =================

    if (sub === "unmutevc") {
      const member = interaction.options.getMember("user");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.voice.setMute(false);

      return interaction.reply({ content: "🔊 Server-mute removed." });
    }

    // ================= SAY =================

    if (sub === "say") {
      const text = interaction.options.getString("text");

      await interaction.channel.send(text);

      return interaction.reply({
        content: "✅ Message sent.",
        ephemeral: true
      });
    }

    // ================= EMBED =================

    if (sub === "embed") {
      const text = interaction.options.getString("text");

      const embed = new EmbedBuilder()
        .setDescription(text)
        .setColor("Blue");

      await interaction.channel.send({ embeds: [embed] });

      return interaction.reply({
        content: "✅ Embed sent.",
        ephemeral: true
      });
    }

    // ================= POLL =================

    if (sub === "poll") {
      const question = interaction.options.getString("question");

      await interaction.reply({ content: `📊 ${question}` });

      const msg = await interaction.fetchReply();
      await msg.react("👍");
      await msg.react("👎");
    }

    // ================= ANNOUNCE =================

    if (sub === "announce") {
      const text = interaction.options.getString("text");

      return interaction.reply({
        content: `📢 **ANNOUNCEMENT**\n\n${text}`
      });
    }

    // ================= DM =================

    if (sub === "dm") {
      const member = interaction.options.getMember("user");
      const text   = interaction.options.getString("text");

      if (!member) {
        return interaction.reply({ content: "❌ User not found.", ephemeral: true });
      }

      await member.send(text).catch(() => {});

      return interaction.reply({ content: "✅ DM sent.", ephemeral: true });
    }

    // ================= AVATAR =================

    if (sub === "avatar") {
      const user =
        interaction.options.getUser("user") || interaction.user;

      return interaction.reply({
        content: user.displayAvatarURL({ dynamic: true, size: 1024 })
      });
    }

    // ================= USERINFO =================

    if (sub === "userinfo") {
      const user =
        interaction.options.getUser("user") || interaction.user;

      return interaction.reply({
        content: `👤 **${user.tag}**\n🆔 ${user.id}`
      });
    }

    // ================= SERVERINFO =================

    if (sub === "serverinfo") {
      return interaction.reply({
        content: `🏠 **${interaction.guild.name}**\n👥 ${interaction.guild.memberCount} members\n🆔 ${interaction.guild.id}`
      });
    }

    // ================= PING =================

    if (sub === "ping") {
      return interaction.reply({
        content: `🏓 **${client.ws.ping}ms**`
      });
    }
  }
};
