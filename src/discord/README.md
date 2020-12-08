# Discord Bot Setup

Make sure to setup Discord before starting your app.

## Initial Setup

Before you deploy your Hangar, follow these steps to generate the token needed for deployment:

- Create an app on the [Discord Developer Site](https://discord.com/developers/applications)
- Using the sidebar, navigate to "_Bot_" and create a new bot
- Copy the bot token and add it to your `.env` file as "DISCORD_BOT_TOKEN"
- On Discord copy the channel ID by right clicking the channel where you want your Bot to communicate
- Add the Channel ID to the `.env` file as "DISCORD_BOT_CHANNEL_IDS"
- Using the sidebar, navigate to "_General Information_" and copy the Client ID
- Replace `YOUR_CLIENT_ID` in the following url with the copied id, go to it in your browser, and add it to your Discord server
  - `https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot`
- Under Server Settings > Roles and add a new role
- Under Server Setting > Members add the role you created to the Bot you created

## Smoke Test

Send a DM to the bot saying "!ping" and it should reply "pong".
