# purgeBOT

This bot has a singular goal: to PURGE all members without a role. A lot of the code is quite messy. At some point I'll clean it up.

Aaaaaand it has a few more tricks up its sleeves too. 

## Commands:

- `%purgenorole`: Kicks all members from the server that don't have a role. (Moderator or Administrator Only)

- `%countlessthan "number of roles"`: Gets a count of how many members in the server have less than the `number of roles` provided in the command. (Moderator or Administrator Only) 

- `%banstartswith "username"`: Bans all members who's username starts with the `username` provided in the command. (Moderator or Administrator Only)

- `%purgepending`: Kicks all users who have completed the Membership Screening but have yet to complete the captcha. These users will only have the Pending role. (Moderator or Administrator Only)
