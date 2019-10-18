![](../../workflows/Build/badge.svg)
![](../../workflows/Deploy/badge.svg)


# Hangar
One stop for all the tools hackathon sponsors need


# CI/CD
This project uses GitHub Actions for both CI and CD. For CD, the app is deployed to Heroku (by default, just when an event is pushed to the `master`). After forking the repo, the following steps must be taken for your Actions to function properly:
1. [Generate a Heroku API Key](https://help.heroku.com/PBGP6IDE/how-should-i-generate-an-api-key-that-allows-me-to-use-the-heroku-platform-api)
1. Add `HEROKU_API_KEY` to your GitHub repo's Secrets
1. [Create a Heroku app](https://dashboard.heroku.com/new-app?org=personal-apps)
1. Add `APP_NAME` using your Heroku app name to your GitHub repo's Secrets
1. Push to `master` to trigger the `Deploy` Action