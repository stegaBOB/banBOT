const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();
client.on('ready', () => {
    console.log("I am ready!");
});

client.on('message', message => {
    const memberId = message.author.id;
    if(!message.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    else if(message.content === "%banhammer"){
        if(getConfirmation(message, "Are you sure you want to ban all members without a role?")){
            message.reply('Banning all members without a role...');
        }else{
             return;
        }
    }
});


function getConfirmation(message, prompt) {
    message.reply(prompt+"\nConfirm with a thumb up or deny with a thumb down.")
    .then();
    react('👍').then(r => {
        message.react('👎');
    });
    message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
    { max: 1, time: 30000 }).then(collected => {
        if (collected.first().emoji.name == '👍') {
            return true;
        } else {
            message.reply('Operation canceled.');
            return false;
        } 
    }).catch(() => {
        message.reply('No reaction after 30 seconds, operation canceled');
        return false;
    });
}


client.login(process.env.BOT_TOKEN);