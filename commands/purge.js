module.exports = {
    name: 'purge', // command name is purge
    description: 'Delete a ceratin number of messages from [1,99]',
    aliases: ['delete', 'prune'], // calling these names will also activate this command
    guildOnly: true, //true (does not work in dms) or false (works in dms)
    usage: '[req: amount]', //make sure we require a int that is an amount
    cooldown: 1, // 1 second cooldown
    execute(message, args) { //parameters, for now, just use message and args
        // check to make sure that the user can manage channels
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            // inform user they don't have permission
            return message.reply("You do not have permissions to use this command. :(");
        }

        //converts string number to int
        const amount = parseInt(args[0]);

        // make sure that 'amount' is a number
        if (isNaN(amount)) {
            // if amount is not a number then inform the user they need to type a number
            return message.reply("Please type in a valid number.\nCommand usage: !purge [number of messages to delete (no brackets needed)]");
        }
        // avoids out of bounds exception, limit is 99 and have to delete 1 message when using
        else if (amount < 1 || amount > 99) {
            return message.reply("It is only possible to delete 1 - 99 messages");
        } else {
            // delete amount of messages, catch any errors, and then reply with the amount of messages actually deleted
            message.channel.bulkDelete(amount, true).catch(err => {
                // catch error
                console.log(err);
                message.channel.send("Error: messages cannot be deleted");
            }).then(deleted => {
                // reply with number of messages deleted
                message.reply(`Congrats! You deleted ${deleted.size} messages successfully!:star_struck:`)
            });
        }
    },
};