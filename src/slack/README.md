# Slack App Setup
To get your app up and running, you'll need to follow two sets of instructions: one before you deploy your Hangar app and one after it's up and running.

## Initial Setup
Before you deploy your Hangar, follow these steps to generate secrets needed for deployment:
- Create an app on the [Slack API Site](api.slack.com/apps)
- Using the sidebar, navigate to the "_Bot Users_" and enable your bot
  - We reccommend using your company name as the app name (e.g., `American Airlines`/`@americanairlines` for the display name and username respectively)
  - We also recommend enabling "Always Show My Bot as Online"
- Using the sidebar, navigate to the "_Basic Information_", scroll down, and copy the `Verification Token` value and write it down somewhere safe
- Using the sidebar, navigate to the "_Install App_" and click "Reinstall App"
  - Once finished, copy the `Bot User OAuth Access Token` value and write it down somewhere safe

  At this point, you can deploy and start your Hangar app. Once you're done, complete the section below to complete your configuration.

## After Deploying Hangar
Once your Hangar app is up and running, use it's URL for the following steps:
- Using the sidebar, naviate to "__"
- Using the sidebar, navigate to "_Interactive Components_" and enable them
  - For the `Request URL` field, use your Hangar app's URL and then append `/slack/events`
- Using the sidebar, navigate to "_Event Subscriptions_" and enable them
  - For the `Request URL` field, use your Hangar app's URL and then append `/slack/events`
  - Under "_Subscribe to bot events_" add the `message.im` scope
- After clicking save, you should see a banner at te top of the page suggesting you reinstall the app; click `Reinstall` 

# Developing Locally
To develop locally, use [`ngrok`](https://ngrok.com) to make your app accessible to Slack and then use that URL for for all the app steps above