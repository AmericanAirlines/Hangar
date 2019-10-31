![](../../workflows/Build/badge.svg)


# Hangar
One stop for all the tools hackathon sponsors need

# Using Hangar
You don't need to be technical to create your own instance of Hangar. Follow they steps below and you'll be up and running in less than 5 minutes!

## Creating a Slack App
Before you can use Hangar, you'll need to create a Slack app. Follow our [instructions for creating an app](./src/Slack/README.md#initial-setup). Once you're done with the first section, continue below.

## Deploying Hangar to Heroku
Once your Slack app is up and running, click the button below and complete the form using your Slack secrets.

[![Deploy to Heroky](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/AmericanAirlines/Hangar/tree/master)

## Completing Your Configuration
Once your app is running, copy your app's URL and complete the [final configuration of your Slack app](./src/Slack/README.md#after-deploying-hangar).

## Customizing Hangar
If you'd like to customize the app, fork this repo. If you have an idea for something and you'd like to contribute back to this project, [create a new Feature request](../../../issues/new?template=feature_request.md). If we like your suggestion, we'll ask you to open a Pull Request. For more details, check out our [Contributing Guidelines](./.github/CONTRIBUTING.md).

When you're ready to deploy your app, simply change the URL for the `Deploy to Heroku` button then merge it into your `master` branch. Once your repo is updated, just use that button you'll be good to go!

<!-- After the front end display for help queue is created, describe overriding the template here -->

## CI/CD
This project uses GitHub Actions for Continuous Integration and leverages Heroku for Continuous Deployment.

If you fork this project, deploy your app using the `Deploy to Heroku` button above, then navigate to the `Deploy` tab of your app in Heroku and configure Continuous Deployment as relevant for your app.

# Local Development
Hangar uses Postgres 11, so you'll need to set it up on your machine, create a database (we suggest `hangar`, if you chose something else or are running your server on a different port, make sure to create a `DATABASE_URL` value in `.env` with your override URL), and then run the app. When the app is deployed to a cloud environment, the `DATABASE_URL` `.env` var will be used (and is automatically set in Heroku when an associated service is connected to your app).

## Database Changes
If the database is changed, the migrations must be changed accordingly. After starting the app (or using `npm run typeorm migration:run`), make changes to files in the `src/entities` directory as needed and then run `npm run typeorm migration:generate -- -n MigrationName` where `MigrationName` is the name of the new migration (after creating a new entity) or an existing migration name (without the timestamp).

# Contributing
Interested in contributing to the project? Check out our [Contributing Guidelines](./.github/CONTRIBUTING.md).
