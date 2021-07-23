/**
 * @author Sammy (stegaBOB)
 * 
 * @dev If you want to start up a purgeBOT on your own, add a .env file that contains
 *      `BOT_TOKEN="YOUR BOT TOKEN HERE"` or just replace the process.env.BOT_TOKEN 
 *      in client.login with your token. Also, make sure to enable "SERVER MEMBERS INTENT" 
 *      under the "Privileged Gateway Intents" section in the Bot category on the Discord bot page.
 */ 
require('dotenv').config();
const { Client, Intents } = require("discord.js");
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);
const client = new Client({ ws: { intents } });
client.on('ready', () => {
    console.log("I am ready!");
});

client.on('message', message => {
    if(!message.guild || message.member === null) return;

    //Moderator only commands:
    if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.find(r => r.name === "Moderator")) {
        if(message.content.toLowerCase() === "%countpurge"){
            countRoles(message);
            return;
        } else if (message.content.toLowerCase() === "%countonlyusers" || message.content.toLowerCase() === "%countusers"){
            countRoles(message, 2);
            return;
        } else if (message.content.toLowerCase() === "%countlessthan" || message.content.toLowerCase().startsWith("%countroles")){
            let numRoles = parseInt(message.content.split(' ')[1]);
            countRoles(message, numRoles);
            return;
        }
    }


    //Admin only commands:

    if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.toLowerCase() === "%purgenorole"){
            message.reply("Are you sure you want to kick all members without a role?\n"+
            "Confirm with a thumb up or deny with a thumb down.")
            .then(m => {
                m.react('👍').then(r => {
                m.react('👎');});
                m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                { max: 1, time: 15000 }).then(collected => {
                    if (collected.first().emoji.name == '👍') {
                        message.channel.send('Kicking all members without a role...');
                        purgeNoRole(message);
                    } else {
                        message.channel.send('Operation canceled.');
                    } 
                }).catch(() => {
                    message.channel.send('No reaction after 15 seconds, operation canceled');
                });
            });
        }
    }
});

function purgeNoRole(message){
    console.log("PURGING");
    message.guild.members.fetch()
    .then(members=>{
        const promises = [];
        members.each(member=>{
            if(member.roles.cache.size < 2){
                setTimout(()=>{
                    promises.push(member.kick("Member has no roles. Authentication has not been completed."));
                }, 1000);
            }
        })
        Promise.all(promises)
        .catch(() => {
            console.error;
        })
        .then(results=>{
            message.channel.send(`Kicked ${results.length} members.`);
            console.log(`Kicked ${results.length} members.`);
        });
    })
    .catch(console.error);
}

function countRoles(message, lessThanRoles = 1){
    console.log(`COUNTING MEMBERS WITH LESS THAN ${lessThanRoles} ROLE(S)`);
    message.guild.members.fetch()
    .then(members=>{
        let i = 0;
        members.each(member=>{
            if(member.roles.cache.size < (lessThanRoles+1)){
                i++;
            }
        });
        console.log(`There are ${i} members with less than ${lessThanRoles} role(s).`);
        message.channel.send(`There are ${i} members with less than ${lessThanRoles} role(s).`);
    });
}

client.login(process.env.BOT_TOKEN);