const { MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'roles', // name of the command is roles
    description: 'Simply react to a role to receive it!',
    aliases: [],
    guildOnly: true, // true (does not work in dms) or false (works in dms)
    cooldown: 1, // this method coolsdown after 1 second
    // using async to wait until the user waits for the user to respond
    async execute(message, args) {
        // creates a new embeded message
        let embed = new MessageEmbed()
            .setTitle('Server Roles')
            .setDescription('🎮 - Gamers\n' + '👾 - Advanced\n' + '💻 - Beginners\n' + '🎲 - Coders\n' + '📲 - Testers')
            .setColor('00688B')
            // waits for embeded message to send the message to channel
        let sentEmbed = await message.channel.send(embed);
        // send all reactions that are appropriate
        sentEmbed.react('🎮')
        sentEmbed.react('👾')
        sentEmbed.react('💻')
        sentEmbed.react('🎲')
        sentEmbed.react('📲')

        //delete the server role in 40 seconds.
        sentEmbed.delete({ timeout: 40000 });
    }
};