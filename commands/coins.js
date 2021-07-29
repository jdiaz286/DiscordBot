const { prefix } = require('../config.json');

module.exports = {
    name: 'coins', // name of the command is roles
    description: 'Returns the amount of coins a user has.',
    aliases: ['bal', 'balance'],
    guildOnly: true, // true (does not work in dms) or false (works in dms)
    usage: '',
    cooldown: 1.5, // this method coolsdown after 1 second
    // using async to wait until the user waits for the user to respond
    execute(message, args, con) {
        // function that comma seperates a number
        function commas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }

        // save the user who called the command
        let target = message.mentions.users.first() || message.author;

        // select all info from database that belongs to target
        con.query(`SELECT * FROM BotTable WHERE id = '${target.id}'`, (err, rows) => {
            // catch any exceptions 
            if (err) throw err;

            // if nothings is returned then return an error
            if (!rows[0]) return message.channel.send(`This user has never had any coins :( Type  ${prefix}search for coins`);

            // get the amount of coins (no commas)
            let coins = rows[0].cur;

            // separate the coin amount with commas
            let comCoins = commas(coins)

            // return the amount of coins the target has
            message.channel.send(`<@${target}> has ${comCoins} coins! :tada:`);
        });
    }
};