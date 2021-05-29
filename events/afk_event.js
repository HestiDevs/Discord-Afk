const Discord = require('discord.js');
const db = require("quick.db");

module.exports = {
  name: 'message',
  async execute(message) { 
    if(message.author.bot)return;
    if(message.channel.type == "dm")return;

    if(db.has(`afk-${message.guild.id}.${message.author.id}`)) {
      const info = db.get(`afk-${message.guild.id}.${message.author.id}`)
      await db.delete(`afk-${message.guild.id}.${message.author.id}`)
      message.reply(`**welcome back** Your Afk Has Been Removed 👋`).then(msg => {
        msg.delete({ timeout: 10000 })
      })
    }

    //checking for mentions
    if(message.mentions.members.first()) {
      if(db.has(`afk-${message.guild.id}.${message.mentions.members.first().id}`)) {
        message.channel.send(message.mentions.members.first().user.tag + " ***is in AFK mode***\n**Reason**: " + await db.get(`afk-${message.guild.id}.${message.mentions.members.first().id}`) ).then(msg => {
          msg.delete({ timeout: 10000 })
        })
      }else return;
    }else;
  }
}
