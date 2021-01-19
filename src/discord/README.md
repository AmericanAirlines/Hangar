# Discord Bot Setup

Make sure to setup Discord before starting your app.

## Initial Setup

Before you deploy your Hangar, follow these steps to generate the token needed for deployment:

- Create an app on the [Discord Developer Site](https://discord.com/developers/applications)
- Using the sidebar, navigate to "_Bot_" and create a new bot
- Copy the bot token and add it to your `.env` file as "DISCORD_BOT_TOKEN"
- Using the sidebar, navigate to "_General Information_" and copy the Client ID
- Replace `YOUR_CLIENT_ID` in the following url with the copied id, go to it in your browser, and add it to your Discord server
  - `https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot`

### Responding with Helpful Info in Public Channels

If you want your bot to respond with helpful info in public channels, follow the _optional_ steps below:

- Enable developer mode: Discord Preferences > Appearance > "Developer Mode" (_at the bottom_)
- In Discord, right click the channel in the sidebar and choose "Copy ID"
- Add the Channel ID to the `.env` file as `DISCORD_BOT_CHANNEL_IDS`
- Repeat for each desired channel, separate items in `DISCORD_BOT_CHANNEL_IDS` with commas (e.g., )

## Smoke Test

Send a DM to the bot saying "!ping" and it should reply "pong".
