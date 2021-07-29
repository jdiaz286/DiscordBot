module.exports = {
    name: 'cipher', // Name of the command is cipher
    description: 'Encodes/Decodes a message using the caesar cypher shift schema',
    aliases: ['caesar'], // can also be called by caesar
    guildOnly: false, // true (does not work in dms) or false (works in dms)
    usage: '[req: shift] [req: en/de] [req: string]', // require shift distance, encode or decoding, and the word/phrase
    cooldown: 1, // coolsdown after every second
    execute(message, args) {
        // these are the aliases for encode/decode, either will be accepted
        const decodeKeyWords = ['decode', 'decrypt', 'undo', 'de', 'decipher'];
        const encodeKeyWords = ['encode', 'crypt', 'do', 'en', 'cipher'];

        // if the first parameter is not a number, send error message 
        if (isNaN(args[0])) {
            return message.channel.send(`Woah there buckaroo! You need to give me a shift value!`)
                // if the first parameter is a number...
        } else {
            // make sure number is within alphabet range, if not then send error message
            if (args[0] > 25 || args[0] < 0) {
                return message.channel.send(`Woah there buckaroo! You need to give me a number from 0 to 25!`)
                    // make sure everything after shift distance is valid
            } else {
                // get the first arg and save as int for shift distance by removing
                const originalShift = parseInt(args.shift());
                // get the first arg and save as the type, encode or decode, by removing
                const cipherType = args.shift();

                // if cipherType is empty, send an error message
                if (!cipherType) {
                    return message.channel.send(`Woah there buckaroo! You need to tell me whether to encode or decode`)
                        // make sure everything after cipherType is valid
                } else {
                    // if the string is less than 1 then remove 
                    if (args.length === 0) {
                        return message.channel.send(`Woah there buckaroo! You need to give me a string!`)
                    } else {
                        // combine any spaces in the string
                        let str = args.join(" ");

                        // decode the message
                        if (decodeKeyWords.indexOf(cipherType) > -1) {
                            let shift = (26 - originalShift) % 26;
                            const decoded = caesarShift(str, shift);
                            message.channel.send(`Decoded: \`${str}\`, the result is the following: \n\`\`\`${decoded}\`\`\``);
                            // encode the message
                        } else if (encodeKeyWords.indexOf(cipherType) > -1) {
                            let shift = originalShift;
                            const encoded = caesarShift(str, shift);
                            message.channel.send(`Encoded: \`${str}\` with a shift of \`${shift}\`, the result is the following: \n\`\`\`${encoded}\`\`\``);
                        } else {
                            message.channel.send(`Woah there buckaroo! You need to tell me whether to encode or decode`)
                        }
                    }
                }
            }
        }

        // function that uses caesar's cipher to shift a message
        function caesarShift(str, shift) {
            let result = "";
            // loop through every letter in the string
            for (let i = 0; i < str.length; i++) {
                // use ascii table values for character
                let c = str.charCodeAt(i);
                // execute if the new character is uppercase
                if (65 <= c && c <= 90) {
                    result += String.fromCharCode((c - 65 + shift) % 26 + 65); // Uppercase string
                    // execute if the new character is lowercase
                } else if (97 <= c && c <= 122) {
                    result += String.fromCharCode((c - 97 + shift) % 26 + 97); // Lowercase string
                    // add the character as a string
                } else {
                    result += str.charAt(i);
                }
            }
            return result;
        }
    },
};