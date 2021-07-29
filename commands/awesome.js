module.exports = {
    name: 'awesome', //the name of this command is awesome
    description: 'Just to let you know that you\'re an awesome human being',
    aliases: [], //no aliases
    guildOnly: false, //true (does not work in dms) or false (works in dms)
    usage: '[req: @user]', //we need a user to mention
    cooldown: 1, //1 second cooldown
    execute(message, args) {
        let target = message.mentions.users.first() || message.author;
        message.channel.send("<@" + target + "> You\'re an awesome human being :100:"); //send the user a message and ping the target using " <@ >", :emoji_name: sends emojis.
    },
};