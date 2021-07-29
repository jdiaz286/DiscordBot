const fetch = require('node-fetch'); // this will allow us to get data from a node

module.exports = {
    name: 'crypto', // Name of the command is crypto
    description: 'Get the current stats of a Cryptocurrency using CoinCap API',
    aliases: [], // can also be called by these names
    guildOnly: false, // true (does not work in dms) or false (works in dms)
    usage: '[req: name]', // requires the user to type in a crypto name
    cooldown: 1, // coolsdown after every second
    async execute(message, args) {
        // function that comma seperates a number   
        function commas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }

        try {
            // save all properties of the domain and name
            let crytpoName = args[0];
            crytpoName = crytpoName.toLowerCase();
            const domain = "https://api.coincap.io/v2/assets/" + crytpoName;

            // get html data and convert to json data
            const received = await fetch(domain);
            const json = await received.json();

            // makes long numbers more legible
            let price = Math.round(json.data.priceUsd * 100) / 100;
            price = commas(price);
            let marketCap = Math.round(json.data.marketCapUsd * 100) / 100;
            marketCap = commas(marketCap);
            let volume = Math.round(json.data.volumeUsd24Hr * 100) / 100;
            volume = commas(volume);
            let percentChange = Math.round(json.data.changePercent24Hr * 100) / 100;

            // embeded message that saves key data
            const positiveEmbed = {
                title: `Current ${json.data.name} key metrics`,
                color: 0x28ff02,
                fields: [{
                        name: "Symbol: ",
                        value: `${json.data.symbol}`,
                        inline: false,
                    }, {
                        name: "Price(USD): ",
                        value: `$${price}`,
                        inline: false,
                    }, {
                        name: "Percent change in the past 24 hours: ",
                        value: `${percentChange}%`,
                        inline: false,
                    },
                    {
                        name: "Current ranking: ",
                        value: `#${json.data.rank}`,
                        inline: false,
                    },
                    {
                        name: "Market Cap(USD): ",
                        value: `${marketCap}`,
                        inline: false,
                    },
                    {
                        name: "Volume in the past 24 hours(USD): ",
                        value: `${volume}`,
                        inline: false,
                    },
                ],
                image: {
                    url: "https://www.ideasbynature.com/wp-content/uploads/2018/07/coincap-logo-dark.jpg",
                },
                timestamp: new Date(),
                footer: {
                    text: 'Powered by CoinCap',
                },
            };
            const negativeEmbed = {
                title: `Current ${json.data.name} key metrics`,
                color: 0xff2200,
                fields: [{
                        name: "Symbol: ",
                        value: `${json.data.symbol}`,
                        inline: false,
                    }, {
                        name: "Price(USD): ",
                        value: `$${price}`,
                        inline: false,
                    }, {
                        name: "Percent change in the past 24 hours: ",
                        value: `${percentChange}%`,
                        inline: false,
                    },
                    {
                        name: "Current ranking: ",
                        value: `#${json.data.rank}`,
                        inline: false,
                    },
                    {
                        name: "Market Cap(USD): ",
                        value: `${marketCap}`,
                        inline: false,
                    },
                    {
                        name: "Volume in the past 24 hours(USD): ",
                        value: `${volume}`,
                        inline: false,
                    },
                ],
                image: {
                    url: "https://www.ideasbynature.com/wp-content/uploads/2018/07/coincap-logo-dark.jpg",
                },
                timestamp: new Date(),
                footer: {
                    text: 'Powered by CoinCap',
                },
            };

            // determine whether to give green or red embeded message
            if (percentChange < 0) {
                return message.channel.send({ embed: negativeEmbed });
            } else {
                return message.channel.send({ embed: positiveEmbed });
            }
            //console.log("Crpyto id: " + json.data.id);
            //return message.channel.send("Name: " + json.data.name + ".\nCrypto ID: " + json.data.id + ". \nCurrent Price: " + json.data.priceUsd);
        } catch (e) {
            console.error(e);
            return message.channel.send("Could not get data. Be sure crypto name is spelled correctly.");
        }
    },
};