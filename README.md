<p align="center">
  <img src="./docs/Logo.png" width="300px"/>
  <br />
  <br />
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" aria-title="License: MIT" />
  </a>
  ![](../../workflows/Build/badge.svg?branch=main)
  <img src="https://img.shields.io/badge/Author-%40americanairlines-blue" />

  <center width="400">
    Sponsoring a student hackathon? You've come to the right place! American Airlines loves to help students learn new tech and we're passionate about being a big part of hackathons.
  </center>
</p>

## Getting Started

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

   We recommend using [Postgres.app](https://postgresapp.com/) as the installation doesn't require a password and is generally easier to use that the traditional Postgres app below.

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

   #### Updating Mikro-ORM

   The process to update all packages is a little painful because ALL Mikro-ORM dependencies across BOTH packages must be kept in sync. Run both commands below (after modifying the version to match whatever target needed)

   ```sh
   # API
   yarn workspace @hangar/api add @mikro-orm/core@^6.0 @mikro-orm/knex@^6.0 @mikro-orm/postgresql@^6.0 mikro-orm@^6.0

   # DB
   yarn workspace @hangar/database add @mikro-orm/cli@^6.0 @mikro-orm/core@^6.0 @mikro-orm/knex@^6.0 @mikro-orm/migrations@^6.0 @mikro-orm/postgresql@^6.0 @mikro-orm/seeder@^6.0 mikro-orm@^6.0
   ```

   #### Restoring a Production DB locally

   In order to debug an issue locally, it can be helpful to mirror the prod DB locally. When doing so, make sure to avoid actions that will trigger text messages because user data is REAL. Always re-seed the DB after fixing your issue to avoid sending erroneous texts.

   ⚠️ **WARNING**: Make sure to follow these steps closely. Making an error below has the potential to overwrite production data if your token allows for write access.

   1. Open TablePlus (no need to connect to a DB)
   1. Go to `File > Backup` (Windows steps TBD), choose your **production** database connection
   1. Select the prod database
   1. Make sure the Postgres version is `PostgreSQL 14.0` and set the options to be `--no-owner` and `--format=custom`
   1. Click `Start Backup`
   1. (_OPTIONAL_) Drop all current data to ensure your local copy is an exact replica, otherwise some local data may persist
      1. Open a connection to your **local** database, select all tables and functions (`command + a` on macOS), right click, and choose "Delete"
      1. When prompted, check the option for `Cascade` and click `OK`
   1. Wait for the backup to finish and then go to `File > Restore` (Windows steps TBD), choose your **local** database connection
   1. Remove all flags from the left hand side (primarily, `--single-transaction` which will cause your restore to fail on conflict)
   1. Select your database on the right hand side
   1. Click `Start restore`

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

   ### Slack

   To configure Slack notifications for certain events, create a Slack app use the following manifest after selecting `From an app manifest` (NOTE: watch out for whitespace issues when copying):

   ```yml
   display_information:
     name: Hangar Dev (YOUR_FIRST_NAME)
     description: Dev bot for testing integrations
     background_color: '#000000'
   features:
     bot_user:
       display_name: Hangar (YOUR_FIRST_NAME)
       always_online: false
   oauth_config:
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

   After installation, copy the `Bot User OAuth Token` value (starting with `xoxb-`) and use that for your `SLACK_BOT_TOKEN`.

   You will also need to got to `App Home` and use `Cient ID` and `Client Secret` as your `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`, respectively.

   For Slack OAuth to work, your bot needs to be configured with your redirect URL. Go to `OAuth & Permissions` and add a new Redirect URL that = `[your ngrok address]/api/auth/callback/slack`

   Channel IDs can be obtained by right clicking a channel in the sidebar and removing the last path value from the URL.

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
1. Downloading [Docker Desktop](https://docs.docker.com/desktop/) and start it
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
