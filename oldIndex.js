/*
Note: This file was meant to act as the driver for all other commands and modules
*/

// load discord.js modules
const Discord = require('discord.js');
// retrieve the bot prefix and token from config.json
const { prefix, token } = require('./config.json')
    // create new instance of Discord.Client()
const client = new Discord.Client();
// save the bot login token
//const token = "NzYzODc4MjI4MTcwMzc1MjM5.X3-HCQ.WSs4q6mncAFBQmYYzd4fhpsmvK8";

// confirm that bot is ready to run
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    //this will check if a message starts with the bot prefix or if the message sender is a Discord bot themselves
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //will take messages from Discord and check if they match the commands below 
    const args = message.content.slice(prefix.length).split(' '); //acm
    const command = args.shift().toLowerCase();

    //comment if you don't want to log every message to the console to check if bot is working
    console.log(message.content);

    //ping message
    if (command === 'ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong! :ping_pong:');
        // name message
    } else if (command === "info") {
        message.channel.send("Hello, I am Jonathan's bot, happy to be of service!");
    }
    /*
    else if (command === "awesome") {
        message.channel.send(awesome.execute);
    }
    */
});

client.login(token);