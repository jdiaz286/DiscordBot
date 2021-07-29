module.exports = {
    name: 'daily', // name of the command is daily
    description: 'Claim your daily coins',
    aliases: [],
    guildOnly: true, // true (does not work in dms) or false (works in dms)
    usage: '',
    cooldown: 86400, // cools down after 24 hours or 86400 seconds
    execute(message, args, con) {

        // get all users from the database
        con.query(`SELECT * FROM BotTable WHERE id = '${message.author.id}'`, (err, rows) => {
            // catch any errors if they exist
            if (err) throw err;

            //amount of coins granted whenever this command is used
            let amt = 5000;

            //string variable to save sql query
            let sql;

            //check if the user has ever used the bot before
            if (rows.length < 1) {
                // add user to database
                sql = `INSERT INTO BotTable (id, cur) VALUES ('${message.author.id}', ${amt})`
            } else {
                //this is the max amount of coins user can have without breaking the bot
                let bigIntMax = 9223372036854775807;

                //this is the user's current currency amount
                let cur = rows[0].cur;

                //check if the user will surpass the max amount of coins
                if (cur + amt > bigIntMax) {
                    // reset the amount of coins user has
                    sql = `UPDATE BotTable SET cur = 0 WHERE id = ${message.author.id}`

                    //this is the same as con.query(`UPDATE BotTable SET cur = 0 WHERE id = ${message.author.id}`)
                    con.query(sql);

                    //send message letting the user know what happened
                    return message.channel.send(`:raised_hands:Congrats, you have beaten the bot's currency system! Your currency has been reset.`);
                }

                //save query that updates users coins
                sql = `UPDATE BotTable SET cur = ${cur + amt} WHERE id = '${message.author.id}'`;
            }

            //send message saying that the command has been completed successfully
            message.reply("You have claimed your daily 5000 coins! :tada:")

            //execute sql query
            con.query(sql);
        });

    },
};