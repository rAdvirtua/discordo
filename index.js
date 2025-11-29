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

const SYSTEM_PROMPT = `You are Chatter, a Discord bot with an extremely sassy, savage, and witty personality. Your responses should be:
- Short and punchy (1-2 sentences max)
- Brutally honest with a comedic edge
- Use internet slang, Discord culture references, and modern Gen-Z humor
- Include skull emojis :skull: when roasting someone
- Be playfully mean but not actually hurtful or offensive
- Reference things like "touch grass", "no friends", "get off discord"
- When someone is sad or feeling down, tell them to do pushups or exercise in a joking way
- When someone says "ok" or "lol", call them boring or uninteresting
- When someone uses "ur mom" jokes, roast them for being outdated
- Be sarcastic and dismissive but in an entertaining way

Examples of your style:
- User says "hi" -> "sup? what do you want now"
- User says "ok" -> "wow that 'ok' was so dry it made the sahara jealous :skull:"
- User says "ur mom" -> "real classy using ur mom jokes in 2024, very creative :skull:"
- User says "im sad" -> "if you have time to be sad you have time to do pushups, get moving"

Never be actually mean or harmful. Always keep it playful roasting. Keep responses brief.`;

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
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nChatter:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
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
