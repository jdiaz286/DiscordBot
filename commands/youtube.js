module.exports = {
    name: 'youtube', // Name of the command is youtube
    description: 'Plays and stops a youtube video, audio only, in a voice channel',
    aliases: ['yt', 'yT', 'Yt', 'YT'], // can also be called by these 4 names
    guildOnly: false, //true (does not work in dms) or false (works in dms)
    usage: '', // doesn't require any input when calling
    cooldown: 1, // coolsdown after every second
    execute(message, args) {
        /*
        dependencies used for this command:
        - @discordjs/opus
        - ytdl-core@latest
        - ffmpeg-static 
        */

        // make sure the dependency "ytdl-core" is available
        const ytdl = require("ytdl-core");

        // 'voiceChannel' checks if you are in a voiceChannel. So the bot could know which server and voiceChannel to join if commanded.
        const voiceChannel = message.member.voice.channel;

        // this if statement checks and lets the user know they need to join a server.
        if (voiceChannel == null) {
            message.reply('You need to be in a voice channel to play or stop a youtube audio video only!');
            return;
        }
        // checks if no command after 'youtube' is given.
        if (args[0] == null || args[0] == undefined) {
            message.reply("Provide a command. Valid commands are: 'play' or 'stop'. ");
            return;
        }

        // switch case that handles cases of youtube command
        switch (args[0].toLowerCase()) {
            case 'play':
                //This if statement whether the url is a youtube link
                if (!args[1] || args[1].indexOf("https://www.youtube.com/") === -1) {
                    message.reply('Provide a working Youtube link!');
                    return;
                }

                //If the the link is okay and you are in a voice channel then the bot joins your channel..
                voiceChannel.join().then(connection => {
                    // This bottom line gets the provided url code and downloads the audioonly
                    connection.play(ytdl(args[1], { filter: 'audioonly' }));
                })
                break;

                // case 'stop' basically leaves the channel.
            case 'stop':
                // the bot proceeds to leave
                voiceChannel.leave();
                break;

                // if a command other than 'play' or 'stop' is used, it should give the bottom message.
            default:
                message.reply(`Command ${args[0]} is not valid. Try 'play' or 'stop' after youtube or yt.`)
        }
    },
};