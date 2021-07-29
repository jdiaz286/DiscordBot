const fetch = require('node-fetch'); //this will allow us to get data from a node

module.exports = {
    name: 'csjoke',
    description: 'Returns a random computer science themed joke!',
    aliases: [],
    guildOnly: false,
    usage: '',
    cooldown: 1,
    async execute(message, args) {
        try {
            // program waits until joke "fetches" a joke from the API 
            const res = await fetch('https://official-joke-api.appspot.com/jokes/programming/random');
            // program waits until json() formats the joke
            const json = await res.json();

            // returns message to the channel
            return message.channel.send(json[0].setup + "\n\n" + json[0].punchline);
        } catch (e) {
            // catch any errors if they exist and send message
            console.error(e);
            return message.channel.send('Could not obtain joke :confused: ');
        }
    },
};