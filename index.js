const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
const fs = require('fs');

const allowedWords = fs.readFileSync('allowedlist.txt', 'utf-8').split('\n');
const answersList = fs.readFileSync('answerlist.txt', 'utf-8').split('\n');

const allowedWordsSet = new Set([...allowedWords, ...answersList]);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let answer = answersList[getRandomInt(answersList.length)];
console.log(answer);
let attempts = [];
let won = false;

function reset(){
    answer = answersList[getRandomInt(answersList.length)];
    console.log(answer);
    attempts = [];
    won = false;
}

client.on('ready',() => console.log('I am ready' || process.env.PORT));

client.on('message', (message) => {

    if(message.author.bot){
        return;
    }

    if(message.content.startsWith('wordle')){
        if(message.content.length === 6){
            if(attempts.length < 1){
                message.reply('There has been no attempts for this word. Type "wordle" followed by your guess to guess the word');
                return;
            }
        }

        if(message.content.length !== 12){
            message.reply('Enter a five letter word.')
            return;
        }

        let guess = message.content.slice(7, 12)

        if(!(allowedWordsSet.has(guess))){
            message.reply('Not a valid word. Try again.');
            return;
        }

        attempt = ''
        for(i = 0; i < 5; i++){
            if(guess[i] == answer[i]){
                attempt += '🟩';
            }
            else if(answer.includes(guess[i])){
                attempt += '🟨';
            }
            else{
                attempt += '⬛';
            }
        }
        attempts.push(attempt);
        let replyString = '\n'

        for(attempt of attempts){
            replyString += attempt + '\n';
        }

        message.reply(replyString);

        if(guess === answer){
            won = true;
            message.reply('Congrats you won!');
            reset();
            return;
        }

        if(attempts.length === 6){
            message.reply('oh no u lost how lame. the word was '+ answer);
            reset();
            return;
        }
    }
})

client.login('OTQxMDY4OTEyNTA4OTU2Njkz.YgQkuA.04a6-dPTmwSwVgx6zpM-Kxz1eIQ');