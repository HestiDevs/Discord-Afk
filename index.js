const discord = require("discord.js");
const client = new discord.Client({
    disableEveryone: true
})
let config = require("./config.json")

client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

const fs = require('fs');
const { readdirSync } = require("fs");

const commandFolders = fs.readdirSync("./cmds");
for(const folder of commandFolders){
    const commandFiles = fs.readdirSync(`./cmds/${folder}`).filter(file => file.endsWith(".js"))
    for(const file of commandFiles){
        const command = require(`./cmds/${folder}/${file}`);
        client.commands.set(command.name, command)
    }
}

const eventFiles = fs.readdirSync('./eventos').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./eventos/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.on("message",async message =>{
var prefix  = config.prefix 
  if(message.author.bot)return;
  if(message.content.match(`^<@!?${client.user.id}>( |)$`)){
  let embed = new Discord.MessageEmbed()
  .setTitle("Hello! ")
  .setDescription("My prefix is `"+prefix[0]+"`")
  .setThumbnail(client.user.displayAvatarURL())
  .setFooter("usa "+prefix+"help para ver mis comandos")
  .setColor("RANDOM")
  message.channel.send(embed)
  return;
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  if(!message.content.startsWith(prefix)) return;
  
  
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if(!commandName)return;
  if (!command) return message.channel.send("`❌ Invalid command");
  
  
  //onlycreator
  if (command.onlycreator && message.author.id !== config.owner){
    return message.channel.send('Only my creator can run this');
  }//fin

  ///perms to the user
  if (command.permissions) {
  const authorPerms = message.channel.permissionsFor(message.author);
  if (!authorPerms || !authorPerms.has(command.permissions)) {
      return message.channel.send('you need the following permissions \n`'+command.permissions+'`');
  }
  }//fin

  ///perms to the bot
  if (command.permissionsme) {
  if (!message.guild.me.hasPermission(command.permissionsme) ) {
      return message.author.channel.send('I need the following permissions\n\`'+command.permissionsme+'`');
  }
  }//fin

  //args NON
  if (command.args && !args.length) {
  let who = `You have not provided arguments, ${message.author}!`;
  
  if (command.usage) {
      who += `\nThe proper use would be \`${prefix}${command.name} ${command.usage}\``;
  }
  return message.channel.send(who);
  }//fin
  
  const { cooldowns } = client;
  
      if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Discord.Collection());
      }
  
      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;
  
      if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
  
          if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000;
              return message.channel.send(`Please wait ${timeLeft.toFixed(1)} sec before using again \`${prefix}${command.name}\` `);
          }
      }
  
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  
  
  try{
    command.execute(client, message, args , prefix);
  } catch (error) {
  console.error(error);
  message.channel.send('```❌ | An error occurred while executing the command```');
  }
  
  })


client.login(config.token);