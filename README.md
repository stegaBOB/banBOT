# purgeBOT

This bot has a singular goal: to PURGE all members without a role. 

## Commands:

- `%purgenorole`: Kicks all members from the server that don't have a role. (Moderator or Administrator Only)

- `%testpurge`: Runs through a `%purgenorole` command as a test but uses a fetch user command in replace of kick. No users will be kicked. (Moderator or Administrator Only) 

- `%countpurge`: Gets a count of how many members don't have a role after the @everyone role. (Moderator or Administrator Only)

- `%countonlyusers` or `%countusers`: Gets a count of how many members have only one role after the @everyone role. (Moderator or Administrator Only)

- `%countlessthan "number of roles"`: Gets a count of how many members in the server have less than the `number of roles` provided in the command. (Moderator or Administrator Only) 

- `%banstartswith "username"`: Bans all members who's username starts with the `username` provided in the command. (Moderator or Administrator Only)

- `%purgepending`: Kicks all users who have completed the Membership Screening but have yet to complete the captcha. These users will only have the Pending role. (Moderator or Administrator Only)