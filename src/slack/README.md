# Slack App Setup
To get your app up and running, you'll need to follow two sets of instructions: one before you deploy your Hangar app and one after it's up and running.

## Initial Setup
Before you deploy your Hangar, follow these steps to generate secrets needed for deployment:
- Create an app on the [Slack API Site](https://api.slack.com/apps)
- Using the sidebar, navigate to "_OAuth & Permissions_" and enable them
  - Under '_Scopes_' --> '_Bot Token Scopes_' click `Add an OAuth Scope` and add the following scope:
    - `im:history`
    - `im:write`
    - `mpim:write`
    - `users:read`
    - `chat:write`
- Using the sidebar, navigate to the "_App Home_" and enable your bot
  - Scroll to "_How Your App Displays_" and click "_Edit_" next to "_App Display Name_" (we reccommend using your company name as the app name, e.g., `American Airlines`/`@americanairlines` for the display name and username respectively)
  - We also recommend enabling "Always Show My Bot as Online"
- Using the sidebar, navigate to the "_Basic Information_", scroll down, and copy the `Signing Secret` value and write it down somewhere safe
- Using the sidebar, navigate to the "_Install App_" and click "Reinstall App"
  - Once finished, copy the `Bot User OAuth Access Token` value and write it down somewhere safe

At this point, you can deploy and start your Hangar app by clicking on the `Deploy to Heroku` button in your repo. You will be prompted for the values above and once it's deployed, complete the section below to complete your configuration.

## After Deploying Hangar
Once your Hangar app is up and running, use it's URL for the following steps:
- Using the sidebar, navigate to "_Interactive Components_" and enable them
  - For the `Request URL` field, use your Hangar app's URL and then append `/slack/events`
- Using the sidebar, navigate to "_Event Subscriptions_" and enable them
  - For the `Request URL` field, use your Hangar app's URL and then append `/slack/events`
  - Under "_Subscribe to bot events_" add the `message.im` scope
- After clicking save, you should see a banner at te top of the page suggesting you reinstall the app; click `Reinstall` 

## Smoke Test
To confirm that Hangar is up and running, from Slack send a direct message to the Bot. You're up and running if you get a response!

# Developing Locally
Copy or rename `.env.sample` to `.env` and update the values from the Initial Setup above

To develop locally, use [`ngrok`](https://ngrok.com) to make your app accessible to Slack and then use that URL for for all the app steps above.
