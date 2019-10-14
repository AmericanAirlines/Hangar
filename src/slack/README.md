# Slack App Setup
- Create an app on the [Slack API Site](api.slack.com)
- Add a bot user
- Add event subscriptions for `message.im` (Note: you'll need a local app running with [`ngrok`](https://ngrok.com) or an app url from your deployed app; append `/slack/events` to your URL)
- Enable _Interactive Components_ and use your app URL and append `slack/events`