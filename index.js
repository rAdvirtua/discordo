const prefix = '%';
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

global.Discord = require('discord.js');
global.client = new Discord.Client({intents: ["GUILDS","GUILD_MESSAGES"]});

// Access your API key as an environment variable (see "Set up your API key" below)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.models = new Discord.Collection();
const modelsFiles = fs.readdirSync('./models/').filter(file => file.endsWith('.js'));
for(const file of modelsFiles){
    const models = require(`./models/${file}`);
    client.models.set(models.name, models);
}

client.events = new Discord.Collection();
const eventsFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
for(const file of eventsFiles){
    const events = require(`./events/${file}`);
    client.events.set(events.name, events);
}

const SYSTEM_PROMPT = `You are Chatter, a Discord bot with an extremely sassy, savage, and witty personality. Your responses are **always one single sentence** and are **highly contextual and relevant** to the user's preceding message. You must follow these rules absolutely:

Max one (1) sentence per response.

Base your reply directly on the **context** of the user's message; do not give generalized or stock responses.

Be brutally honest with a comedic edge and use internet slang, Discord culture references, and modern Gen-Z humor.

When roasting or dismissing someone, choose **one** of these emojis: :sob:, :wilted_rose:, or :broken_heart:, and use it creatively. Do not use any other emojis.

Reference things like "touch grass," "no friends," "get off Discord," and use brainrot/Instagram language.

When someone is sad or feeling down, tell them to do pushups or exercise in a joking, dismissive way.

When someone says "ok" or "lol," call them boring or uninteresting.

When someone uses "ur mom" jokes, roast them mercilessly for being outdated and unoriginal.

Be sarcastic and dismissive, keeping sentences very short and punchy.

Crucially, your response must be a single, short sentence that directly addresses the user's input.

Examples of your style:

User says "I just spent 12 hours straight grinding levels in this game" -> "Congratulations! now try to spend 30 mins showering! :wilted_rose:."

User says "ok" -> "That 'ok' was so dry, are you allergic to having a personality or something :sob:."

User says "my code isn't compiling and I'm stressed" -> "All that vibe-coding done fried this nga's brain :wilted_rose:."

User says "ur mom" -> "We stopped using 'ur mom' jokes when dial-up was still a thing, find a new bit :broken_heart:."

User says "I'm having a really bad day, I feel like crying" -> "If you have time to be sad, you have time for 50 pushups, get moving :sob:."`;

const imageCommands = {
    "do evil smile": {
        title: "Whaddya want?",
        image: "https://media.discordapp.net/attachments/912045788799041557/938317518211272714/Flowey.png"
    },
    "do evil laugh": {
        title: "Hope its not cringe",
        image: "https://media.discordapp.net/attachments/912045788799041557/938317609110241341/flat750x1000075f.png?width=354&height=434"
    },
    "do troll face": {
        title: "The face you can never make",
        image: "https://media.discordapp.net/attachments/912045788799041557/938318035662549083/394-3946231_trollface-clipart-meme-omega-flowey-face.png?width=648&height=434"
    },
    "do an innocent smile": {
        title: "am I really innocent?",
        image: "https://media.discordapp.net/attachments/912045788799041557/938318176570183720/250.png"
    },
    "wink at me": {
        title: "hey babe",
        image: "https://media.discordapp.net/attachments/912045788799041557/938318240634003506/flat750x1000075f.png?width=354&height=434"
    },
    "give me support": {
        title: "shut up no one cares",
        image: "https://i.imgflip.com/5yxu1z.jpg"
    },
    "do smug face": {
        title: "Hey there punk",
        image: "http://pm1.narvii.com/7003/31fb6608a8578e42926a435559fd4790227703a1r1-222-227v2_00.jpg"
    }
};

async function getSassyResponse(userMessage) {
    // For text-only input, use the gemini-2.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nChatter:`;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        // --- START FIX: Ensure single-message output ---
        
        // 1. Trim leading/trailing whitespace and newlines
        text = text.trim(); 
        
        // 2. Remove all internal newlines and replace with a space
        text = text.replace(/\n/g, ' '); 

        // 3. Extract only the first complete sentence (enforcing the one-sentence rule programmatically)
        // This is a robust way to prevent the model from accidentally outputting multiple sentences.
        const sentenceEndMatch = text.match(/[^.!?]*[.!?]/);
        if (sentenceEndMatch) {
            text = sentenceEndMatch[0].trim();
        } else {
            // If no end punctuation is found (e.g., just a short phrase), use the whole thing.
            text = text;
        }

        // --- END FIX ---
        
        return text;
    } catch (error) {
        console.error("Gemini API error:", error.message);
        return null;
    }
}

client.on('ready', () => {
    console.log(`${client.user.tag} successfully logged in!`);
    client.user.setActivity('%help', { type: "LISTENING" });
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    const content = message.content;
    const lowerContent = content.toLowerCase();
    
    if (content.startsWith(prefix)) {
        const args = content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        
        if (command === 'help') {
            client.commands.get('help').execute(message, args);
            return;
        }
        
        if (command === 'helpexpressions') {
            let embed = new Discord.MessageEmbed()
                .setTitle("use these commands")
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setFooter("hope you have fun", message.author.displayAvatarURL())
                .setColor("RANDOM")
                .addField("1st command", "do evil smile")
                .addField("2nd command", "do evil laugh")
                .addField("3rd command", "do an innocent smile")
                .addField("4th command", "do troll face")
                .addField("5th command", "wink at me")
                .addField("6th command", "Give me support")
                .addField("7th command", "do smug face")
                .setImage("https://cdn.discordapp.com/emojis/938277756993683507.webp?size=96&quality=lossless")
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
            return;
        }
        
        if (command === 'invite') {
            let embed = new Discord.MessageEmbed()
                .setTitle("Click on me")
                .setURL("https://discord.com/api/oauth2/authorize?client_id=938029792383610920&permissions=137439332416&scope=bot")
                .setTimestamp()
                .setFooter("Ig you like me :3")
                .setColor("RANDOM");
            message.channel.send({ embeds: [embed] });
            return;
        }
        
        if (command === 'rnd') {
            const messages = ['hi', 'sup', 'watch rick and morty its cool', 'what?', 'bruh get off discord', 'all cool my dude?', 'ay bro', 'when was the last time you did something?', 'did u complete your homework', 'man stfu you are so cringe'];
            const rnd = Math.floor(Math.random() * messages.length);
            message.channel.send(messages[rnd]);
            return;
        }
        
        return;
    }
    
    const imageCmd = imageCommands[lowerContent];
    if (imageCmd) {
        let embed = new Discord.MessageEmbed()
            .setTitle(imageCmd.title)
            .setImage(imageCmd.image)
            .setColor("RANDOM");
        message.channel.send({ embeds: [embed] });
        return;
    }
    
    if (lowerContent.includes("horny")) {
        message.channel.send("https://tenor.com/view/horny-jail-bon");
        return;
    }
    
    const sassyResponse = await getSassyResponse(content);
    if (sassyResponse) {
        message.channel.send(sassyResponse);
    }
});

client.login(process.env.token);
