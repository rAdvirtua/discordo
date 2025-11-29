

module.exports = {
  
  name : 'help',
  description: "this is a help command!",
   
  
    execute(message, args1){
    let embed = new Discord.MessageEmbed()
    .setTitle("How to use me")
  
    .setAuthor(message.author.username, message.author.displayAvatarURL())
    
    embed.setFooter("hope you have fun", message.author.displayAvatarURL())
    .setColor("RANDOM")
    .addField("1st command", "hey bot")
    .addField("2nd command", "your mom")
    .addField("3rd command", "Nothing")
    .addField("4th command", "lol")
    .addField("5th command", "yes(use different variations of yes to get a modified answer)")
    .addField("6th command", "no (use different variations of no to get a modified answer)")
    .addField("6th command", "why/why tho")
    .addField("7th command","nah")
    .addField("8th command","Im sad add really before sad to get a different message")
    .addField("9th command", "Im depressed add really before depressed to get a different message")
    .addField("10th command", "no you")
    .addField("11th command", "ok")
    .addField("12th command", "die")
    .addField("13th command", "hey bot die")
    .addField("14th command", "chat ded")
    .addField("15th command", "%rnd use it to get a random message")
    .addField("16th command", "ok and?")
    .addField("17th command", "hi/hello/yo")
    .addField("18th command", "Nm wbu? (u can use full forms too just dont expand wbu)")
    .addField("19th command", "%helpexpressions use it to get different expressions for me")
    .addField("20th command", "%invite use it to invite me to your server if you liked me!")
    .setTimestamp()
    .setImage   ("https://cdn.discordapp.com/emojis/938277756993683507.webp?size=96&quality=lossless")

    let embed2 = new Discord.MessageEmbed()
    .setTitle("My creator's youtube channel")
    .setURL("https://www.youtube.com/channel/UCaKOxAjPoOVuR-uoMl51JMw")
    .setFooter("Go sub his channel")
    .setThumbnail("https://images-ext-1.discordapp.net/external/7ZFRAfPcS8f8Q3r8pmwh-DRZWwSAVBPXBd_Nc5Lxq-A/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/740220416853016628/758e1d0b9b6310104152a6ace831764d.png")
    .setColor("RANDOM")
    message.channel.send( { embeds : [embed, embed2], content: "Im a sassy bot used for chatting Im currently limited in many abilities since Im under development if you want to make any changes to me be sure to dm my creator! <@740220416853016628>" } )
  } 
}