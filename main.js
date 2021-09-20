require('dotenv').config();
const Discord = require('discord.js');
const message = require('./events/guild/message');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

require('./database')
const levels = require('./levels')

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command-handler', 'event-handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

module.exports.clientDiscord = client;

levels(client)

client.login(process.env.DISCORD_BOT_TOKEN)


//https://discord.com/api/oauth2/authorize?client_id=858543288637718548&permissions=8&scope=bot%20applications.commands