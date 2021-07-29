module.exports = {
    name: 'leaderboard', // name of the command is leaderboard
    description: 'Shows who has the most coins or experience!',
    aliases: ["lb", "top"], // can also be called using these names
    guildOnly: true, // true (does not work in dms) or false (works in dms)
    usage: '',
    cooldown: 1, // cools down after 1 second
    execute(message, args, con) {
        // function that comma seperates a number   
        function commas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }

        // if user types "!leaderboard xp" then order leaderboard by xp
        if (args[0] === "xp") {
            // get all users and organize by xp in descending order
            con.query(`SELECT * FROM BotTable ORDER BY xp DESC`, (err, rows) => {
                // catch any errors
                if (err) throw err;

                // if there are not enough people send message
                if (!rows[4]) return message.channel.send("Not enough people are ranked to display leaderboard");

                // save an embeded leaderboard with top 5 positions
                const lbEmbed = {
                    color: 0x006F9F,
                    author: {
                        name: 'Leaderboard for most xp!',
                    },
                    fields: [{
                            name: "#1: ",
                            value: `<@${rows[0].id}>: **Level ${Math.floor(rows[0].xp/3000)}**, ${commas(rows[0].xp)} total xp!`,
                            inline: false,
                        },

                        {
                            name: "#2: ",
                            value: `<@${rows[1].id}>: **Level ${Math.floor(rows[1].xp/3000)}**, ${commas(rows[1].xp)} total xp!`,
                            inline: false,
                        },

                        {
                            name: "#3: ",
                            value: `<@${rows[2].id}>: **Level ${Math.floor(rows[2].xp/3000)}**, ${commas(rows[2].xp)} total xp!`,
                            inline: false,
                        },

                        {
                            name: "#4: ",
                            value: `<@${rows[3].id}>: **Level ${Math.floor(rows[3].xp/3000)}**, ${commas(rows[3].xp)} total xp!`,
                            inline: false,
                        },

                        {
                            name: "#5: ",
                            value: `<@${rows[4].id}>: **Level ${Math.floor(rows[4].xp/3000)}**, ${commas(rows[4].xp)} total xp!`,
                            inline: false,
                        }
                    ],
                };
                // send the embeded leaderboard to the channel 
                message.channel.send({ embed: lbEmbed });

            });
        }
        // if the user types in "!leaderboard"
        else {
            // get all standings and order by currency "cur" in descending order
            con.query(`SELECT * FROM BotTable ORDER BY cur DESC`, (err, rows) => {
                // catch any errors
                if (err) throw err;

                // if there is no 5th input then there are not enough users
                if (!rows[4]) return message.channel.send("Not enough people are ranked to display leaderboard");

                // update leader if any changes occur
                if (rows[0].badge2 == 0) {
                    con.query(`UPDATE BotTable SET badge2 = 1 WHERE id = ${rows[0].id}`)
                }

                // save leaderboard as embeded variable 
                const lbEmbed = {
                    color: 0x92C6DD,
                    author: {
                        name: 'Leaderboard for most coins!',
                    },
                    fields: [{
                            name: "#1: ",
                            value: `<@${rows[0].id}>: ${commas(rows[0].cur)} coins!`,
                            inline: false,
                        },

                        {
                            name: "#2: ",
                            value: `<@${rows[1].id}>: ${commas(rows[1].cur)} coins!`,
                            inline: false,
                        },

                        {
                            name: "#3: ",
                            value: `<@${rows[2].id}>: ${commas(rows[2].cur)} coins!`,
                            inline: false,
                        },

                        {
                            name: "#4: ",
                            value: `<@${rows[3].id}>: ${commas(rows[3].cur)} coins!`,
                            inline: false,
                        },

                        {
                            name: "#5: ",
                            value: `<@${rows[4].id}>: ${commas(rows[4].cur)} coins!`,
                            inline: false,
                        }
                    ],
                };
                // send embeded leaderboard to the channel
                message.channel.send({ embed: lbEmbed });

            });
        }
    },
};