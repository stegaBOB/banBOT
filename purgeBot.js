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
     if (!message.guild || message.member === null) return;
 
     //Moderator only commands:
     if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.find(r => r.name === "Moderator")) {
         if (message.content.toLowerCase() === "%countpurge") {
             countRoles(message);
             return;
         } else if (message.content.toLowerCase() === "%countonlyusers" || message.content.toLowerCase() === "%countusers") {
             countRoles(message, 2);
             return;
         } else if (message.content.toLowerCase().startsWith("%countlessthan") || message.content.toLowerCase().startsWith("%countroles")) {
             let numRoles = parseInt(message.content.split(' ')[1]);
             countRoles(message, numRoles);
             return;
         } else if (message.content.toLowerCase().startsWith("%testpurge")) {
             let numRoles = parseInt(message.content.split(' '))[1];
             message.reply("Are you sure you want to test some stuff? Why am I asking?\n" +
                 "Confirm with a thumb up or deny with a thumb down.")
                 .then(m => {
                     m.react('👍').then(r => {
                         m.react('👎');
                     });
                     m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                         { max: 1, time: 15000 })
                         .then(collected => {
                             if (collected.first().emoji.name == '👍') {
                                 message.channel.send('Testing some stuff...');
                                 testPurge(message, numRoles);
                             } else {
                                 message.channel.send('Operation canceled.');
                             }
                         })
                         .catch(() => {
                             message.channel.send('No reaction after 15 seconds, operation canceled');
                         });
                 })
                 .catch(err => {
                     console.err(err);
                     message.channel.send("Uh oh...");
                 });
         } else if (message.content.toLowerCase() === "%purgenorole") {
             message.reply("Are you sure you want to kick all members without a role?\n" +
                 "Confirm with a thumb up or deny with a thumb down.")
                 .then(m => {
                     m.react('👍').then(r => {
                         m.react('👎');
                     });
                     m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                         { max: 1, time: 15000 })
                         .then(collected => {
                             if (collected.first().emoji.name == '👍') {
                                 message.channel.send('Kicking all members without a role...');
                                 purgeNoRole(message);
                             } else {
                                 message.channel.send('Operation canceled.');
                             }
                         })
                         .catch(() => {
                             message.channel.send('No reaction after 15 seconds, operation canceled');
                         });
                 })
                 .catch(err => {
                     console.err(err);
                     message.channel.send("Uh oh...");
                 });
         } else if (message.content.toLowerCase().startsWith("%banstartswith")) {
             let theMessage = message.content.split(' ');
             if (theMessage.length < 2) {
                 message.channel.send('Name parameter not inlcuded in message. Operation canceled.\nExample: `%banstartswith EonCharge`');
                 return;
             } else {
                 let theName = theMessage[1];
                 if (theName.length < 3) {
                     message.channel.send('I think you typed incorrectly. Try again with a username longer than 3 characters. Operation canceled.\nExample: `%banstartswith EonCharge`');
                     return;
                 } else {
                     message.channel.send("Counting members. Please wait...");
                     banStartWithCheck(message, theName);
                 }
             }
         } else if (message.content.toLowerCase() === "%purgepending") {
             message.reply("Are you sure you want to kick all members with only the Pending role?\n" +
                 "Confirm with a thumb up or deny with a thumb down.")
                 .then(m => {
                     m.react('👍').then(r => {
                         m.react('👎');
                     });
                     m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                         { max: 1, time: 15000 })
                         .then(collected => {
                             if (collected.first().emoji.name == '👍') {
                                 message.channel.send('Kicking all members with only the Pending role...');
                                 purgePending(message);
                             } else {
                                 message.channel.send('Operation canceled.');
                             }
                         })
                         .catch(() => {
                             message.channel.send('No reaction after 15 seconds, operation canceled');
                         });
                 })
                 .catch(err => {
                     console.err(err);
                     message.channel.send("Uh oh...");
                 });
         }
     }
 
 
     //Admin only commands:
 
     if (message.member.hasPermission("ADMINISTRATOR")) {
 
     }
 });
 
 function purgeNoRole(message) {
     console.log("PURGING");
     message.guild.members.fetch()
         .then(members => {
             const promises = [];
             let i = 0;
             members.each(member => {
                 if (member.roles.cache.size < 2) {
                     i++;
                     promises.push(member.kick("Member has no roles. Authentication has not been completed."));
                 }
             });
             Promise.all(promises)
                 .then(results => {
                     console.log(`promises.length = ${promises.length}`);
                     console.log(`i = ${i}`);
                     message.channel.send(`Kicked ${promises.length} members.`);
                     console.log(`Kicked ${promises.length} members.`);
                 })
                 .catch(err => {
                     console.error(err);
                     message.reply("I think there was an error kicking members. Blame Bob's poor coding.");
                 });
         })
         .catch(err => {
             console.error(err);
             message.reply("I think there was an error fetching members. Blame Bob's poor coding.");
         });
 }
 
 function purgePending(message) {
     console.log("PURGING");
     message.guild.members.fetch()
         .then(members => {
             const promises = [];
             let i = 0;
             members.each(member => {
                 if (member.roles.cache.size == 2 && member.roles.cache.find(r => r.name === "Pending")) {
                     i++;
                     promises.push(member.kick("Member still pending. Please rejoin and try again."));
                 }
             });
             Promise.all(promises)
                 .then(results => {
                     console.log(`promises.length = ${promises.length}`);
                     console.log(`i = ${i}`);
                     message.channel.send(`Kicked ${promises.length} members.`);
                     console.log(`Kicked ${promises.length} members.`);
                 })
                 .catch(err => {
                     console.error(err);
                     message.reply("I think there was an error kicking members. Blame Bob's poor coding.");
                 });
         })
         .catch(err => {
             console.error(err);
             message.reply("I think there was an error fetching members. Blame Bob's poor coding.");
         });
 }
 
 function banStartWithCheck(message, name) {
     message.guild.members.fetch()
         .then(members => {
             let banList = [];
             members.each(member => {
                 if (member.user.username.startsWith(name)) {
                     banList.push(member);
                 }
             });
             if (banList.length < 1) {
                 message.channel.send(`I couldn't find any members whose name starts with ${name}. Please try again later.`);
                 return;
             }
             message.reply(`Are you sure you want to ban all ${banList.length} members whose name starts with ${name}?\n` +
                 "Confirm with a thumb up or deny with a thumb down.")
                 .then(m => {
                     m.react('👍').then(r => {
                         m.react('👎');
                     });
                     m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                         { max: 1, time: 15000 })
                         .then(collected => {
                             if (collected.first().emoji.name == '👍') {
                                 message.channel.send(`Banning all ${banList.length} members whose name starts with ${name}...`);
                                 banStartsWith(message, name, banList);
                             } else {
                                 message.channel.send('Operation canceled.');
                             }
                         })
                         .catch((err) => {
                             console.log(err);
                             message.channel.send('No reaction after 15 seconds, operation canceled');
                         });
                 })
                 .catch(err => {
                     console.err(err);
                     message.channel.send("Uh oh...");
                 });
         })
         .catch(err => {
             console.err(err);
             message.channel.send("Uh oh...");
         });
 }
 
 function banStartsWith(message, name, banList) {
     console.log("hi");
     if (name.length < 3) {
         message.channel.send("Uh oh. This shouldn't be possible. REEEEEEEEEEE");
         return;
     } else {
         console.log(banList);
         const promises = [];
         banList.forEach(member => {
             promises.push(member.ban({
                 reason: 'Bots!!',
             }));
         });
         Promise.all(promises)
             .then(results => {
                 console.log(results);
                 console.log(`promises.length = ${promises.length}`);
                 message.channel.send(`Successfully banned ${promises.length} members.`);
                 console.log(`Successfully banned ${promises.length} members.`);
             })
             .catch(err => {
                 console.error(err);
                 message.reply("I think there was an error banning members. Blame Bob's poor coding.");
             });
     }
 }
 
 function testPurge(message, numRoles) {
     if (numRoles === null) numRoles = 2;
     console.log("TEST PURGING");
     message.guild.members.fetch()
         .then(members => {
             const promises = [];
             let i = 0;
             members.each(member => {
                 if (member.roles.cache.size < numRoles) {
                     i++;
                     promises.push(member.fetch());
                 }
             });
             Promise.all(promises)
                 .then(results => {
                     console.log(results);
                     console.log(`promises.length = ${promises.length}`);
                     console.log(`i = ${i}`);
                     message.channel.send(`Successfully counted ${promises.length} members.`);
                     console.log(`Successfully counted ${promises.length} members.`);
                 })
                 .catch(err => {
                     console.error(err);
                     message.reply("I think there was an error counting members. Blame Bob's poor coding.");
                 });
         })
         .catch(err => {
             console.error(err);
             message.reply("I think there was an error fetching members. Blame Bob's poor coding.");
         });
 }
 
 function countRoles(message, lessThanRoles = 1) {
     console.log(`COUNTING MEMBERS WITH LESS THAN ${lessThanRoles} ROLE(S)`);
     message.channel.send(`Counting members with less than ${lessThanRoles} roles...`);
     message.guild.members.fetch()
         .then(members => {
             let i = 0;
             members.each(member => {
                 if (member.roles.cache.size < (lessThanRoles + 1)) {
                     i++;
                 }
             });
             console.log(`There are ${i} members with less than ${lessThanRoles} role(s).`);
             message.channel.send(`There are ${i} members with less than ${lessThanRoles} role(s).`);
         })
         .catch(err => {
             console.err(err);
             message.channel.send("Uh oh...");
         });
 }
 
 client.login(process.env.BOT_TOKEN);