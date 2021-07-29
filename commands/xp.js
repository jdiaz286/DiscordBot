module.exports = {
    name: 'xp', // Name of the command is xp
    description: 'Shows your xp',
    aliases: ["experience"], // Can also be called experience
    guildOnly: true, // true (does not work in dms) or false (works in dms)
    usage: '<opt: @user>', // optional to use this command followed by mentioning a user
    cooldown: 1, // cools down after 1 second
    execute(message, args, con) {
        // function to comma seperate a string using regex
        function commas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }

        // save user who will show xp (target can either be user or mention)
        let target = message.mentions.users.first() || message.author;

        // get all users from the database
        con.query(`SELECT * FROM BotTable WHERE id = ${target.id}`, (err, rows) => {
            // catach any errors if they exist
            if (err) throw err;

            // if there are no users return an error
            if (!rows[0]) return message.channel.send("This user does not have enough information on record.");

            //save xp and comma seperate
            let xp = rows[0].xp;
            let comXP = commas(xp);

            // show the user their level
            let level = Math.floor(xp / 3000);
            let remXP = xp % 3000;

            // save an embeded message that contains the users' xp
            const xpEmbed = {
                color: 0x92C6DD,
                author: {
                    name: `${target.username}`,
                    icon_url: target.displayAvatarURL({ format: "png", dynamic: true })
                },
                fields: [{
                    name: "--Experience--",
                    value: `Level: ${level}\nXP to next level: ${3000-remXP}\nTotal XP: ${comXP}`,
                    inline: false,
                }, ]
            }

            // send embeded message to discord channel
            message.channel.send({ embed: xpEmbed });
        });
    },
};