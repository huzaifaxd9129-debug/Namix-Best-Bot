const {
  PermissionsBitField,
  ChannelType
} = require("discord.js");

module.exports = {
  name: "mod",
  aliases: ["moderation"],
  async execute(message, args, client) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply("❌ You do not have permission.");
    }

    const cmd = args[0];
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[1]);

    // ================= HELP =================

    if (!cmd || cmd === "help") {
      return message.channel.send(`
🛡️ MODERATION COMMANDS (50+)

👮 Member:
ban
unban
kick
mute
unmute
timeout
untimeout
warn
warnings
unwarn
nick
resetnick

🧹 Messages:
clear
purgebots
purgeuser
purgeembeds

🔒 Channels:
lock
unlock
hide
unhide
slowmode
nuke
clonechannel
deletechannel
createchannel
renamechannel

🎭 Roles:
role
unrole
roleall
giverolehumans
giverolebots
removeroleall

🔊 Voice:
moveall
disconnect
voicekick
deafen
undeafen
mutevc
unmutevc

🛡️ Security:
antilink
antiinvite
anticaps
antispam
antiemoji
antibadwords
antibot
antiraid

⚙️ Utility:
say
embed
poll
announce
dm
servericon
serverinfo
userinfo
avatar
ping

📁 Logs:
setlogs
clearlogs

🎟️ Tickets:
close
rename
add
remove
transcript
      `);
    }

    // ================= BAN =================

    if (cmd === "ban") {
      if (!member) return message.reply("Mention user.");

      await member.ban({
        reason: args.slice(2).join(" ") || "No reason"
      });

      return message.channel.send(`🔨 Banned ${member.user.tag}`);
    }

    // ================= UNBAN =================

    if (cmd === "unban") {
      const id = args[1];
      if (!id) return;

      await message.guild.members.unban(id);

      return message.channel.send("✅ User unbanned");
    }

    // ================= KICK =================

    if (cmd === "kick") {
      if (!member) return;

      await member.kick();

      return message.channel.send(`👢 Kicked ${member.user.tag}`);
    }

    // ================= TIMEOUT =================

    if (cmd === "timeout") {
      if (!member) return;

      const ms = require("ms");
      const time = ms(args[2]);

      await member.timeout(time);

      return message.channel.send(`⏰ Timed out ${member.user.tag}`);
    }

    // ================= UNTIMEOUT =================

    if (cmd === "untimeout") {
      if (!member) return;

      await member.timeout(null);

      return message.channel.send("✅ Timeout removed");
    }

    // ================= NICK =================

    if (cmd === "nick") {
      if (!member) return;

      const nick = args.slice(2).join(" ");

      await member.setNickname(nick);

      return message.channel.send("✅ Nickname changed");
    }

    // ================= RESETNICK =================

    if (cmd === "resetnick") {
      if (!member) return;

      await member.setNickname(null);

      return message.channel.send("✅ Nickname reset");
    }

    // ================= CLEAR =================

    if (cmd === "clear") {
      const amount = parseInt(args[1]);

      await message.channel.bulkDelete(amount);

      return message.channel.send(`🧹 Deleted ${amount} messages`);
    }

    // ================= LOCK =================

    if (cmd === "lock") {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          SendMessages: false
        }
      );

      return message.channel.send("🔒 Channel locked");
    }

    // ================= UNLOCK =================

    if (cmd === "unlock") {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          SendMessages: true
        }
      );

      return message.channel.send("🔓 Channel unlocked");
    }

    // ================= HIDE =================

    if (cmd === "hide") {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          ViewChannel: false
        }
      );

      return message.channel.send("🙈 Channel hidden");
    }

    // ================= UNHIDE =================

    if (cmd === "unhide") {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        {
          ViewChannel: true
        }
      );

      return message.channel.send("👀 Channel visible");
    }

    // ================= SLOWMODE =================

    if (cmd === "slowmode") {
      const time = parseInt(args[1]);

      await message.channel.setRateLimitPerUser(time);

      return message.channel.send(`🐢 Slowmode set to ${time}s`);
    }

    // ================= NUKE =================

    if (cmd === "nuke") {
      const channel = await message.channel.clone();

      await message.channel.delete();

      channel.send("💥 Channel nuked");
    }

    // ================= CREATECHANNEL =================

    if (cmd === "createchannel") {
      const name = args.slice(1).join("-");

      await message.guild.channels.create({
        name,
        type: ChannelType.GuildText
      });

      return message.channel.send("✅ Channel created");
    }

    // ================= DELETECHANNEL =================

    if (cmd === "deletechannel") {
      await message.channel.delete();
    }

    // ================= RENAMECHANNEL =================

    if (cmd === "renamechannel") {
      const name = args.slice(1).join("-");

      await message.channel.setName(name);

      return message.channel.send("✅ Channel renamed");
    }

    // ================= ROLE =================

    if (cmd === "role") {
      if (!member) return;

      const role = message.mentions.roles.first();

      await member.roles.add(role);

      return message.channel.send("✅ Role added");
    }

    // ================= UNROLE =================

    if (cmd === "unrole") {
      if (!member) return;

      const role = message.mentions.roles.first();

      await member.roles.remove(role);

      return message.channel.send("✅ Role removed");
    }

    // ================= ROLEALL =================

    if (cmd === "roleall") {
      const role = message.mentions.roles.first();

      message.guild.members.cache.forEach(m => {
        m.roles.add(role).catch(() => {});
      });

      return message.channel.send("✅ Role added to all");
    }

    // ================= MOVEALL =================

    if (cmd === "moveall") {
      const channel = message.member.voice.channel;

      if (!channel) return;

      const target =
        message.mentions.channels.first();

      channel.members.forEach(m => {
        m.voice.setChannel(target).catch(() => {});
      });

      return message.channel.send("✅ Moved all users");
    }

    // ================= DISCONNECT =================

    if (cmd === "disconnect") {
      if (!member) return;

      await member.voice.disconnect();

      return message.channel.send("🔌 User disconnected");
    }

    // ================= DEAFEN =================

    if (cmd === "deafen") {
      if (!member) return;

      await member.voice.setDeaf(true);

      return message.channel.send("🔇 User deafened");
    }

    // ================= UNDEAFEN =================

    if (cmd === "undeafen") {
      if (!member) return;

      await member.voice.setDeaf(false);

      return message.channel.send("🔊 User undeafened");
    }

    // ================= MUTEVC =================

    if (cmd === "mutevc") {
      if (!member) return;

      await member.voice.setMute(true);

      return message.channel.send("🔇 Voice muted");
    }

    // ================= UNMUTEVC =================

    if (cmd === "unmutevc") {
      if (!member) return;

      await member.voice.setMute(false);

      return message.channel.send("🔊 Voice unmuted");
    }

    // ================= SAY =================

    if (cmd === "say") {
      const text = args.slice(1).join(" ");

      message.delete();

      return message.channel.send(text);
    }

    // ================= EMBED =================

    if (cmd === "embed") {
      const {
        EmbedBuilder
      } = require("discord.js");

      const embed = new EmbedBuilder()
        .setDescription(args.slice(1).join(" "))
        .setColor("Blue");

      return message.channel.send({
        embeds: [embed]
      });
    }

    // ================= POLL =================

    if (cmd === "poll") {
      const msg = await message.channel.send(
        `📊 ${args.slice(1).join(" ")}`
      );

      await msg.react("👍");
      await msg.react("👎");
    }

    // ================= ANNOUNCE =================

    if (cmd === "announce") {
      const text = args.slice(1).join(" ");

      return message.channel.send(
        `📢 ANNOUNCEMENT\n\n${text}`
      );
    }

    // ================= DM =================

    if (cmd === "dm") {
      if (!member) return;

      const text = args.slice(2).join(" ");

      await member.send(text);

      return message.channel.send("✅ DM sent");
    }

    // ================= AVATAR =================

    if (cmd === "avatar") {
      const user =
        message.mentions.users.first() ||
        message.author;

      return message.channel.send(
        user.displayAvatarURL({ dynamic: true })
      );
    }

    // ================= USERINFO =================

    if (cmd === "userinfo") {
      const user =
        message.mentions.users.first() ||
        message.author;

      return message.channel.send(`
👤 ${user.tag}
🆔 ${user.id}
      `);
    }

    // ================= SERVERINFO =================

    if (cmd === "serverinfo") {
      return message.channel.send(`
🏠 ${message.guild.name}
👥 ${message.guild.memberCount}
🆔 ${message.guild.id}
      `);
    }

    // ================= PING =================

    if (cmd === "ping") {
      return message.channel.send(
        `🏓 ${client.ws.ping}ms`
      );
    }

  }
};
