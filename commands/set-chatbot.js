const {Client, Message, MessageEmbed} = require("discord.js"); 
const Schema = require('../models/chatbot-channel');
module.exports = {
  name: "set-channel",
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args
   */
  run : async (client, message, args) => {
    if(!message.member.permissions.has('ADMINISTRATOR')) return;
    const channel = message.mentions.channels.first() || message.channel; 
    Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
      if(data) data.delete();
      new Schema({
        Guild: message.guild.id,
        Channel: channel.id, 
      }).save();
      message.channel.send('Saved chatbot channel to ${channel}');
      

    });
  },

};