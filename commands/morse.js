module.exports = {
    name: 'morse', //command name is morse
    description: 'This command is able to decode a morse code message',
    aliases: [],
    guildOnly: false, //true (does not work in dms) or false (works in dms)
    usage: '[req: morse string]', //requires the string that is in morse code
    cooldown: 1, //1 second cooldown
    execute(message, args) {
        // variable that saves input without spaces
        let msg = args.join(" ");

        // this will save all morse code values
        const alphabet = {
            "-----": "0",
            ".----": "1",
            "..---": "2",
            "...--": "3",
            "....-": "4",
            ".....": "5",
            "-....": "6",
            "--...": "7",
            "---..": "8",
            "----.": "9",
            ".-": "a",
            "-...": "b",
            "-.-.": "c",
            "-..": "d",
            ".": "e",
            "..-.": "f",
            "--.": "g",
            "....": "h",
            "..": "i",
            ".---": "j",
            "-.-": "k",
            ".-..": "l",
            "--": "m",
            "-.": "n",
            "---": "o",
            ".--.": "p",
            "--.-": "q",
            ".-.": "r",
            "...": "s",
            "-": "t",
            "..-": "u",
            "...-": "v",
            ".--": "w",
            "-..-": "x",
            "-.--": "y",
            "--..": "z",
            "/": " ",
            "-·-·--": "!",
            "·-·-·-": ".",
            "--··--": ","
        };

        // array that will hold the deciphered phrase/sentence
        var messageConverted = [];

        // splits message with a space and then use map to find the matching letter
        msg.split(" ").map(function(letter) {
            // add to messageConverted list the deciphered letter
            messageConverted.push(alphabet[letter]);
        });

        // sends a message that returns the decoded message (messageConverted)
        message.channel.send("Morse code message: " + msg + " \n:face_with_monocle: Your decoded message is: " + "\```" + messageConverted.join("") + "\```" + ":face_with_monocle:");
    },

};