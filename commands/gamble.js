const { prefix } = require('../config.json');

module.exports = {
    name: 'gamble', // name of this command is gamble
    description: `Gamble a random amount of coins! ${prefix}gamble [amount]`,
    aliases: ["bet"], // also known as "bet"
    guildOnly: true, // true (does not work in dms) or false (works in dms)
    usage: '[req: amount]', // require an amount that will be gambled
    cooldown: 1.5, // cools down after every 1.5 seconds
    execute(message, args, con) {
        // function that comma seperates a string using regex
        function commas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }

        // if there is no input after prefix then send message
        if (args.length < 1 || args[0] <= 0 && args != "all") {
            return message.channel.send("You have to gamble *something*, please.");
        }
        // if the input is not a number and not "all"...
        else if (isNaN(args[0]) && args != "all") {
            // notify the user
            return message.channel.send("That's not a number...");
        } else {
            // function to randomly give an amount of coins to user
            function coinsWon(amt) {
                // random float value between 0 and 1
                let rand = Math.random();
                // determine what is the amount won
                if (rand < 0.008) {
                    // return 3000% of bet
                    return amt * 29;
                } else if (rand < 0.035) {
                    // return 1000% of bet
                    return amt * 9;
                } else if (rand < 0.10) {
                    // return 300% of bet
                    return amt * 2
                } else if (rand < 0.30) {
                    // return 200% of bet
                    return amt * 1;
                } else if (rand < 0.35) {
                    // return 150% of bet
                    return amt * 0.5
                } else if (rand < 0.40) {
                    // return 125% of bet
                    return amt * 0.25
                }
                // if rand greater than 0.4 then lose
                else {
                    //lost amount wagered
                    return -1 * amt;
                }
            }

            // get all users from the database
            con.query(`SELECT * FROM BotTable WHERE id = '${message.author.id}'`, (err, rows) => {
                // catch any errors if they exist
                if (err) throw err;

                // if no returned values, send error message
                if (!rows[0]) return message.channel.send(`You have no coins :( Type in ${prefix}search for some coins!`);

                // if command called with "all"...
                if (args[0] == "all") {
                    // set argument as full amount of coin balance
                    args[0] = rows[0].cur;
                }

                // coins wagered more than balance, send error
                if (args[0] > rows[0].cur) {
                    message.channel.send("You cannot gamble more than what you have.");
                    return 0;
                }

                // save reference to sql command to execute
                let sql;

                // save the amount of coins that are won in "gamble"
                let amt = coinsWon(args[0]);

                // save the multiplier of the user
                let multiplier = rows[0].multiplier;

                // if won something then multiply it by user's multiplier
                if (amt > 1) {
                    amt *= multiplier;
                    amt = Math.floor(amt);
                }

                // if first user in database then give a bonus of 9x
                if (message.author.id == 1) {
                    amt = args[0] * 9;
                    amt *= multiplier;
                    amt = Math.floor(amt);
                }

                // make sure the user does not break bot coin limit
                let bigIntMax = 9223372036854775807;
                let cur = rows[0].cur;
                if (cur + amt > bigIntMax) {
                    message.reply("You won " + commas(parseInt(amt)) + " coin(s) and your bet back! :tada:\nPercentage won: " + (((amt) / args[0]) * 100 + 100).toFixed(3) + "%!");
                    con.query(`UPDATE BotTable SET cur = 0 WHERE id = ${message.author.id}`);

                    return message.channel.send(`Congrats, you have beaten the bot's currency system! Your currency has been reset.`);
                }

                // if there are no entries in the database, add user
                if (rows.length < 1) {
                    sql = `INSERT INTO BotTable (id, cur) VALUES ('${message.author.id}', ${amt})`
                } else {
                    sql = `UPDATE BotTable SET cur = ${cur + amt} WHERE id = '${message.author.id}'`;

                }

                // tell user whether they won or lost the wager
                if (amt > 0) {
                    message.reply("You won " + commas(parseInt(amt)) + " coin(s) and your bet back! :tada:\nPercentage won: " + (((amt) / args[0]) * 100 + 100).toFixed(3) + "%!");
                } else {
                    message.reply("You lost " + commas(-1 * amt) + " coin(s) :cry:")
                }

                // execute sql query
                con.query(sql);
            });
        }
    },
};