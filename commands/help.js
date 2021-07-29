// this command will require the config.json.prefix and save it
const { prefix } = require('../config.json');

module.exports = {
    name: 'help', // name of the command is help
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'], // can also be called by 'commands'
    usage: '<opt: command name>', // can be sent a command (optional) to get more info
    cooldown: 1, // coolsdown every second
    execute(message, args) {
        // this array will store all the information about any specific command or all commands the bot can use
        const data = [];
        // same as: const commands = message.client.commands
        // this will just save the commands that the bot has
        const { commands } = message.client;

        // if there are no other inputs besides !help then return a dm to user
        if (!args.length) {
            // add title to array 'data'
            data.push('__Here\'s a list of all my commands:__');
            // add all the command names to array 'data' and join with a ", " after each name
            data.push(commands.map(command => command.name).join(', '));
            // add example command to array 'data'
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            // send dm to user with array 'data'
            return message.author.send(data, { split: true })
                // after the dm is sent, reply to user on channel with a message
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                // catch any errors/exceptions when sending the dm to user
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        // if there is a string after the command name, save it as 'name'
        const name = args[0].toLowerCase();
        // save command name as command that bot recognizes
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        // if the command is not valid then return a error message
        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        // add the name of the command to the array 'data'
        data.push(`**Name:** ${command.name}`);

        // if there exists a alias, add to array 'data'
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        // if there exists a description, send to the array 'data'
        if (command.description) data.push(`**Description:** ${command.description}`);
        // if there exists a usage, send to the array 'data'
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        // send the amount of time needed to wait for a specific command to array 'data'
        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        // send the split array 'data' back to the message channel
        message.channel.send(data, { split: true });

    },
};