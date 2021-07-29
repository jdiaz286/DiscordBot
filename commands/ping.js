module.exports = {
    name: 'ping', // name of the command is ping
    description: 'Simply replies to show that the bot is working by messaging "pong!"',
    aliases: [],
    guildOnly: false, //true (does not work in dms) or false (works in dms)
    usage: '', // doesn't require any other input
    cooldown: 1, // cooldown is 1 second
    execute(message, args) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong! :ping_pong:');
    },
};