const Discord = require('discord.js');
const db = require("quick.db");


module.exports = {
    name:"afk",//command name
    aliases:[],
    description: "Commad AFK",
    args: false,
    usage: "<reason>",  
    category: "Useful",
    permissions: "ADMINSTRATOR",
    cooldown: 7,// in sec
    guildOnly: true,
    
async execute(client, message, args , prefix){  

    let server = message.guild
    let user = message.author
    let razon = args.join(" ")

    if(!razon) razon = "Without reason"
        const embed = new Discord.MessageEmbed()
        .setDescription(`✅ **AFK settled down**\n**Reason :** ${razon}`)
        .setColor("RANDOM")
        .setThumbnail(message.author.avatarURL()) 
        .setFooter("I will notify everyone who mentions you.")
        .setAuthor(message.author.tag,message.author.avatarURL())
    
        message.channel.send(embed)  

	setTimeout(function(){ 
		await db.set(`afk-${server.id}.${user.id}`,razon)
	 }, 750);//To avoid taking away the afk at the same time [you may need more time]
	//time is measured in milliseconds
	
    },
};
