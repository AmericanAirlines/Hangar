<p align="center">
  <img src="./docs/Logo.png" width="300px"/>
  <br />
  <br />
  <img src="https://img.shields.io/badge/Author-%40AmericanAirlines-blue" />
  <img src="https://img.shields.io/badge/Version-main-%5B0%2C0%2C255%5D" />
  <img src="https://github.com/AmericanAirlines/Hangar/actions/workflows/build.yml/badge.svg?branch=main" />
  <a href="https://app.codecov.io/gh/AmericanAirlines/Hangar/tree/main">
    <img src="https://codecov.io/github/AmericanAirlines/Hangar/branch/main/graph/badge.svg" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" aria-title="License: MIT" />
  </a>

  <center width="400">
    Managing a hackathon? You've come to the right place! American Airlines loves to help devs learn new tech and we're passionate about being a big part of hackathons.
  </center>
</p>

## What is Hangar?

Hangar is a hackathon management platform that can help with everything from project registration, communicating prizes, listing schedule info, and provides judging.

#### Features

- **Event info**: share info about the hack with your attendees and link to resources
- **Project registration**: collect info from attendees about their hack
- **Prize info**: communicate prizes of various types
- **Schedule**: list your event schedule so attendees have access
- **Judging**: judge projects either by fixed criteria or by "expo" style comparison judging

## Table of Contents

- [What is Hangar?](#what-is-hangar)
    - [Features](#features)
- [Table of Contents](#table-of-contents)
- [Using Hangar](#using-hangar)
    - [Deployment](#deployment)
    - [Authentication](#authentication)
    - [Feature Utilization](#feature-utilization)
    - [Customization](#customization)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [PostgreSQL](#postgresql)
    - [macOS](#macos)
    - [Windows/macOS/Linux](#windowsmacoslinux)
    - [Viewing/Editing the DB](#viewingediting-the-db)
    - [Seeding the Database](#seeding-the-database)
    - [Database migrations](#database-migrations)
      - [Reverting a migration locally](#reverting-a-migration-locally)
    - [Updating Mikro-ORM](#updating-mikro-orm)
    - [Restoring a Production DB locally](#restoring-a-production-db-locally)
    - [Restarting Table Sequences](#restarting-table-sequences)
  - [SSO](#sso)
    - [Ping Federate](#ping-federate)
    - [Slack](#slack)
  - [Starting the App](#starting-the-app)
  - [Containerization](#containerization)
    - [Building and Running Docker Locally](#building-and-running-docker-locally)
      - [Environment Variables](#environment-variables)
        - [Database User](#database-user)
        - [Troubleshooting](#troubleshooting)

---

## Using Hangar

Interested in deploying an instance of Hangar to help with your hack? Follow the steps below to deploy and customize an instance of Hangar to use with your hack.

#### Deployment

Hangar is containerized via Docker; simply build the docker image and deploy to a cloud environment of your choice. See the sections within [Setup](#setup) to generate the necessary environment variables and make them accessible to your app at runtime.

#### Authentication

Authentication uses OAuth via Ping Federate OR Slack but it can be easily modified to use a new callback from a different OAuth provider. See the [Slack](#slack) or [Ping Federate](#ping-federate) section below for full details on how to setup and configure your Slack app.

#### Feature Utilization

In Hangar's current state, you'll need to manually modify the `Admin` table to create a new record for your admin users. Once created, your admin users will have full access to create judging sessions and see their results.

#### Customization

In order to modify the content of the homepage and to make other modifications to the presentation of the app, simply modify the values in `packages/shared/src/config`.

---

## Development

### Prerequisites

- Node 18+
- [Yarn v1](https://classic.yarnpkg.com/lang/en/)

  > _This project is a monorepo, so Yarn was chosen for better dependency management_

### Setup

1. Open the project via the workspace file (e.g., `code hangar.code-workspace`)

1. Install dependencies

   ```zsh
   yarn
   ```

1. Copy `packages/api/.env.sample` to `packages/api/.env.local`

   ```zsh
   cp packages/api/.env.sample packages/api/.env.local
   ```

   ### PostgreSQL

   If you don't have Postgres installed already, see the `Installation and Use` section below.

   After installing, create a DB with the name `hangar` (or use another name and override `DATABASE_URL` in your `.env.local`).

   <details>
     <summary><strong>Installation and Use</strong></summary>

   #### macOS

   Using [Postgres.app](https://postgresapp.com/) is recommended as the installation doesn't require a password and is generally easier to use that the traditional Postgres app below.

   #### Windows/macOS/Linux

   During the installation process (if you follow the steps on [postgresql.org](https://www.postgresql.org/download/)), you will be prompted to set a password - make sure to use something you'll remember.

   #### Viewing/Editing the DB

   If you'd like a visual way of viewing or editing your local database, try using [TablePlus](https://tableplus.com).

   #### Seeding the Database

   You can seed the database using the `mikro-orm/cli` tool.

   You can drop, create, migrate, and seed the database any time you need with this command (run from `packages/api`):

   - `yarn mikro-orm migration:fresh --seed DatabaseSeeder`

   > :warning: **NOTE**: Running the above command will delete all data in your database

   #### Database migrations

   To run migrations locally, use `yarn migrate` from the root. If you ever want to replace your db contents with a fresh setup, run `yarn db:fresh`.

   If you need to make a new migration, simply run `yarn workspace @hangar/database migration:create`. There are also scripts for running the `up` and `down` commands: `migration:up` and `migration:down` respectively.

   If you need to incorporate a new migration from a recently merged feature branch, run ` yarn db:seed`; `db:seed` will perform the `migration:up` action and seed the db, potentially including data relevant to the new migration.

   ##### Reverting a migration locally

   After creating a migration locally that needs to be reverted, follow the process below to revert your local DB state:

   - Run `yarn @hangar/database migration:down`
   - Delete the new migration
   - Run `yarn @hangar/database snapshot:reset`
     - ⚠️ This will overwrite ANY changes made to your DB structure, not just the last migration
   - Begin the migration creation process again

   #### Updating Mikro-ORM

   The process to update all packages is a little painful because ALL Mikro-ORM dependencies across BOTH packages must be kept in sync. Run both commands below (after modifying the version to match whatever target needed)

   ```sh
   # API
   yarn workspace @hangar/api add @mikro-orm/core@^6.0 @mikro-orm/knex@^6.0 @mikro-orm/postgresql@^6.0 mikro-orm@^6.0

   # DB
   yarn workspace @hangar/database add @mikro-orm/cli@^6.0 @mikro-orm/core@^6.0 @mikro-orm/knex@^6.0 @mikro-orm/migrations@^6.0 @mikro-orm/postgresql@^6.0 @mikro-orm/seeder@^6.0 @mikro-orm/postgresql@^6.0 mikro-orm@^6.0
   ```

   #### Restoring a Production DB locally

   In order to debug an issue locally, it can be helpful to mirror the prod DB locally. When doing so, make sure to avoid actions that will trigger text messages because user data is REAL. Always re-seed the DB after fixing your issue to avoid sending erroneous texts.

   ⚠️ **WARNING**: Make sure to follow these steps closely. Making an error below has the potential to overwrite production data if your token allows for write access.

   1. Open TablePlus (no need to connect to a DB)
   2. Go to `File > Backup` (Windows steps TBD), choose your **production** database connection
   3. Select the prod database
   4. Make sure the Postgres version is `PostgreSQL 14.0` and set the options to be `--no-owner` and `--format=custom`
   5. Click `Start Backup`
   6. (_OPTIONAL_) Drop all current data to ensure your local copy is an exact replica, otherwise some local data may persist
      1. Open a connection to your **local** database, select all tables and functions (`command + a` on macOS), right click, and choose "Delete"
      2. When prompted, check the option for `Cascade` and click `OK`
   7. Wait for the backup to finish and then go to `File > Restore` (Windows steps TBD), choose your **local** database connection
   8. Remove all flags from the left hand side (primarily, `--single-transaction` which will cause your restore to fail on conflict)
   9. Select your database on the right hand side
   10. Click `Start restore`

   #### Restarting Table Sequences

   If you add data manually to your database (through a tool like TablePlus) and do _NOT_ let Postgres assign an `id` automatically, you will disrupt the sequence for that table that determines the _next_ available `id` to assign. If that happens, perform the following queries to restart it.

   Find the appropriate sequence name:

   ```sql
   SELECT sequence_schema, sequence_name
   FROM information_schema.sequences
   ORDER BY sequence_name;
   ```

   Restart the sequence with a new id:

   ```sql
   ALTER SEQUENCE "YOUR_TABLE_SEQUENCE" RESTART WITH THE_NEXT_ID_TO_ASSIGN;
   ```

   (e.g., `ALTER SEQUENCE "Provider_id_seq" RESTART WITH 11;`)

   </details>

   ### SSO

   #### Ping Federate

   Ping Federate is enabled by default for SSO. To configure it, simply add the following environment variables to your `.env.local`:

   - `PINGFED_CLIENT_ID`: Your client ID
   - `PINGFED_CLIENT_SECRET`: Your client secret
   - `PINGFED_AUTH_BASE_URL`: The URL which starts the authentication flow
   - `PINGFED_TOKEN_BASE_URL`: The URL from which the token containing user data can be retrieved

   #### Slack

   To configure the app to use Slack for SSO Authentication, modify the `packages/shared/src/config/auth.ts` and set `slack` as the auth method. Next, create a Slack app using the following manifest after selecting `From an app manifest` (NOTE: watch out for whitespace issues when copying):

   ```yml
   display_information:
     name: Hangar Dev (YOUR_FIRST_NAME)
     description: Dev instance of Hangar
     background_color: '#000000'
   features:
     bot_user:
       display_name: Hangar Dev (YOUR_FIRST_NAME)
       always_online: true
   oauth_config:
     redirect_urls:
       - [YOUR_NGROK_URL]/api/auth/callback/slack
     scopes:
       user:
         - email
         - openid
         - profile
       bot:
         - chat:write
         - chat:write.public
   settings:
     org_deploy_enabled: false
     socket_mode_enabled: false
     token_rotation_enabled: false
   ```

   After creating the app, use the sidebar and go to `Install App` and request to install the app to your workspace. Once approved, head back to this section and `Install to workspace`.

   After installation, go to `OAuth & Permissions` and copy the `Bot User OAuth Token` value (starting with `xoxb-`) and use that for your `SLACK_BOT_TOKEN`.

   You will also need to go to `Basic Information` and use `Client ID` and `Client Secret` as your `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`, respectively.

   For Slack OAuth to work, your bot needs to be configured with your redirect URL. Go to `OAuth & Permissions` if you need to update your Redirect URL (e.g., `[YOUR_NGROK_URL]/api/auth/callback/slack`).

### Starting the App

1. Start the development server

   ```zsh
   yarn dev
   ```

   When you see this success message, open the url to load the site

   ```zsh
   🚀 Listening at http://localhost:3000
   ```

   > The server starts before Next.js finishes compiling, so the first time may take a little bit to load

1. After your initial setup, you'll need to run your database migrations:

   ```
   yarn migrate
   ```

1. Start developing
1. For Slack integration, make sure to copy your ngrok address into `BASE_URL` config var (with no trailing slash!)

### Containerization

Hangar is containerized to make deployment efficient and to prevent vendor-dependence for our cloud environment

#### Building and Running Docker Locally

1. Installing relevant dependencies
1. Duplicate `.env.docker.sample` as `.env.docker` and modify values as needed
1. Download [Docker Desktop](https://docs.docker.com/desktop/) and start it
   - Optionally modify `Settings > Resources > Advanced` to provide more resources to Docker and speed up your build commands
1. Run `yarn docker:build` from the root to build your image
1. Run `yarn docker:run` to start your container
1. Visit `localhost:3001` to use the app running in Docker

##### Environment Variables

`packages/api/.env.local` is used as the base for all environment variables but `.env.docker` will override any specified environment variables as needed.

###### Database User

On macOS Postgres user/pass is typically not required. If you do not use one in your API `.env.local`, you WILL need to specify one in `.env.docker`; the password is typically blank (no value needed) and your username is typically your machine `user` (use `whoami` in terminal).

###### Troubleshooting

If you are unable to start your Docker app, make sure the steps above have been followed, then:

- Check the accuracy of your `.env.docker` and `packages/api/.env.local` values (the former will override the latter)
- Make sure no quotes are used in either file; Docker does not remove them and your value will include them
- You can use Docker Desktop to inspect the environment: `Docker Desktop > Containers / Apps > hangar` (environment variables can be found on the `Inspect` tab)
