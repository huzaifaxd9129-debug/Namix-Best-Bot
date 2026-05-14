module.exports = {
  name: "welcome",

  async execute(message, args) {
    if (args[0] !== "variables") return;

    message.reply(
`📘 **Welcome Variables**

{user} → Mention user
{username} → Username
{server} → Server name
{members} → Member count

Example:
Welcome {user} to {server}! 🎉`
    );
  }
};
