module.exports = {
    name: 'search', // name of the command is search
    description: 'Search for a random amount of coins from 1-200! 0.01% chance to find 20% of the coins you currently have!',
    aliases: [],
    guildOnly: true, // true (does not work in dms) or false (works in dms)
    usage: '',
    cooldown: 1.5, // cools down after 1.5 seconds
    execute(message, args, con) {
        //function to comma seperate a string
        function commas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }

        //function to get a random amount of coins
        function searchAmt() {
            let min = 1;
            let max = 200;

            //return random amount of coins
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //get all users from the database
        con.query(`SELECT * FROM BotTable WHERE id = '${message.author.id}'`, (err, rows) => {
            //catch any errors if found
            if (err) throw err;

            //if there are no coins then send message
            if (!rows[0]) return message.channel.send(`You have not used the currency system yet! Use ${prefix}hourly or ${prefix}daily to start!`);

            //save the amount of currency from the user
            let cur = rows[0].cur;

            //variable to save the amount that is found
            let amt;

            //get a random number (between 0 and 1) to represent chance
            if (Math.random() < 0.98) {
                amt = searchAmt();
            } else {
                amt = cur * 0.2;
            }

            //max value that will break the bot
            let bigIntMax = 9223372036854775807;

            //check to make sure the amount of coins won't break the bot
            if (cur + amt > bigIntMax) {
                //summarize the amount of coins that were found and updata database
                message.reply("You found " + commas(amt.toFixed(3)) + " coins! :tada:");
                con.query(`UPDATE BotTable SET cur = 0 WHERE id = ${message.author.id}`);

                //notify user of excesive amount of coins obtained
                return message.channel.send(`Congrats, you have beaten the bot's currency system! Your currency has been reset.`);

            }

            //summarize the amount of coins that were found and updata database
            message.reply("You found " + commas(amt.toFixed(3)) + " coins! :tada:");
            con.query(`UPDATE BotTable SET cur = ${cur + amt} WHERE id = '${message.author.id}'`);

        });
    }
}