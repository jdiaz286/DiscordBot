const fs = require('fs'); //node's file system
const Discord = require('discord.js'); //require discord.js
const { prefix, token, sql } = require('./config.json'); //take prefix and token from config
const mysql = require("mysql2"); //require mysql2 to connect to mysql database
const client = new Discord.Client(); //create a new reference to new Discord.Client()

client.commands = new Discord.Collection(); //creates clients commands parameter and sets to new Collection()

//read and save all commmands in folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// loop through all files and save command to client.commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//this is if you want cooldowns for your commands
const cooldowns = new Discord.Collection();

// create mysql connection that requires: host, user, password, and database name 
let con = mysql.createConnection({
    host: sql.host,
    user: sql.user,
    password: sql.password,
    database: sql.database
});

// connect to mysql database
con.connect(err => {
    // catch error if found
    if (err) throw err;
    // confirm connectin to database
    console.log("Connected to database!");
});

function generateXP() {
    let min = 10;
    let max = 30;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//display ready inside console when bot is ready
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    con.query(`SELECT * FROM BotTable WHERE id = '${message.author.id}'`, (err, rows) => {
        if (err) throw err;

        let sql;

        if (rows.length < 1) {
            sql = `INSERT INTO BotTable (id, xp, cur) VALUES ('${message.author.id}', ${generateXP()}, 0)`;
        } else {
            let xp = rows[0].xp;
            sql = `UPDATE BotTable SET xp = ${xp + generateXP()} WHERE id = '${message.author.id}'`;
        }

        con.query(sql);
        //con.query(sql, console.log);
    });

    //check if a message was sent by a bot user and if it has the bot prefix at the beginning of the message
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //filters the message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    function timeFormat(duration) {
        // Hours, minutes and seconds
        let hrs = Math.floor(duration / 3600);
        let mins = Math.floor((duration % 3600) / 60);
        let secs = Math.floor(duration % 60);

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            return message.reply(`please wait ${timeFormat(timeLeft)} before reusing the \`${command.name}\` command.`);
            //this returns the same thing
            //return message.reply("please wait " + timeLeft.toFixed(1) + "more second(s) before reusing the " + command.name + "command.");
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, con);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

// this section is meant to be executed with roles.js
client.on("messageReactionAdd", async(reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id === '846787513242091525') {
        //put emoji on the reafction and the await is copy the id of the server roles in server settings
        if (reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('854553307607859200');
        } else if (reaction.emoji.name === '👾') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('854553396617674762');
        } else if (reaction.emoji.name === '💻') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('854553486254538752');
        } else if (reaction.emoji.name === '🎲') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('854553552205643826');
        } else if (reaction.emoji.name === '📲') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('854553613962969089');
        }
    }
});

client.on("messageReactionRemove", async(reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id === '723451780704370700') {
        //put emoji on the reafction and the await is copy the id of the server roles in server settings
        if (reaction.emoji.name === '🎮') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('729763426473214053');
        } else if (reaction.emoji.name === '👾') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('730226583637590057');
        } else if (reaction.emoji.name === '💻') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('730226453144272956');
        } else if (reaction.emoji.name === '🎲') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('729763531179950170');
        } else if (reaction.emoji.name === '📲') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('730279012764745759');
        }
    }
});

client.login(token);