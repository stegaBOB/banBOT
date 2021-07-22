const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log("I am ready!");
});

const filter = (reaction, user) => reaction.emoji.name === '' && user.id === 'someID'
message.awaitReactions(filter, { time: 15000 })

client.on('message', message => {
    const memberId = message.author.id;
    if(!message.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    else if(message.content === "%banhammer"){
        message.reply("Are you sure you want to ban all members without a role?\n"
            + "Confirm with a thumb up or deny with a thumb down.");
        message.react('👍').then(r => {
            message.react('👎');
        });

        message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
        { max: 1, time: 30000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                        message.reply('Banning all members without a role...');
                        // doBanMembers();
                }
                else
                        message.reply('Operation canceled.');
        }).catch(() => {
                message.reply('No reaction after 30 seconds, operation canceled');
        });
    }
});


function getConfirmation(message, prompt) {
    message.reply(prompt+"\nConfirm with a thumb up or deny with a thumb down.");
    message.react('👍').then(r => {
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
