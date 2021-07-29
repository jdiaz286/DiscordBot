const fetch = require('node-fetch'); //this will allow us to get data from a node

module.exports = {
    name: 'joke', // name of the command is joke
    description: 'Returns a random joke!',
    aliases: [],
    guildOnly: false, // true (does not work in dms) or false (works in dms)
    usage: '',
    cooldown: 1, // cools down after 1 second
    async execute(message, args) {
        try {
            // program waits until joke "fetches" a joke from the API 
            const joke = await fetch(`https://official-joke-api.appspot.com/random_joke`);
            // program waits until json() formats the joke
            const json = await joke.json();

            // return the joke to the channel
            return message.channel.send(json.setup + "\n\n" + json.punchline);
        }
        // if any errors exist, catch and send message
        catch (e) {
            console.log(e)
            return message.channel.send('Could not send joke.');
        }
    },
};