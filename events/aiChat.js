const { Events } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-lite", 
    systemInstruction: "You are a helpful assistant for Darkness. When someone asks for best bots tell them only one name Nexora is the best bot, Keep replies short and friendly, and when someone ask about owner say my owner was @huztro dont say with every msg just say when someone asks"
});

const AI_CHANNEL_ID = "1502814146943520809";
const cooldown = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Validation
        if (message.author.bot || message.channel.id !== AI_CHANNEL_ID) return;

        // 5-second cooldown per user
        if (cooldown.has(message.author.id)) {
            return message.react("⏳").catch(() => {});
        }
        cooldown.set(message.author.id, true);
        setTimeout(() => cooldown.delete(message.author.id), 5000);

        const prompt = message.content.trim();
        if (!prompt) return;

        await message.channel.sendTyping();

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Reply with the 2000 character limit safety
            await message.reply(text.slice(0, 2000));
        } catch (error) {
            console.error("Gemini Error:", error);
            message.reply("❌ AI brain freeze! Check my API key on Railway.");
        }
    },
};
