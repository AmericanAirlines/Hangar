# Migrations

## What are they?

To easily manage changes to a production database with no downtime, we need to be able to modify the database automatically. The best way to make that happen is with database migrations. They tell the application how to migrate the database from one state to another.

A database migration is made up of two methods, `up` and `down`. The `up` method has the queries required to migrate the database into the needed state, and the `down` method has the queries required to migrate the database out of the current state.

```typescript
import { Migration } from '@mikro-orm/migrations';

export class Migration20210927202814 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table "user" ("id" bigserial primary key, "createdAt" timestamptz(0) not null default clock_timestamp(), "updatedAt" timestamptz(0) not null default clock_timestamp(), "name" text not null, "email" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table "user";');
  }
}
```

> An example migration

When your application is deployed it takes the following steps to make sure the database is ready before starting.

> TODO: Insert image showing a flow-chart of the steps

## How do I use them?

### Creating a new one

Make sure you are inside of the `api` package

```zsh
cd packages/api
```

Run the following to create a new migration file

```zsh
yarn mikro-orm migration:create
```

Shortly you will see this prompt, enter a helpful name that will be in the name of the file

```
What does this migration do? (Keep it short, it's going in the file name)
Example: add the user table

>
```

For example, entering `add the user table` would create a file like `src/migrations/####-add-the-user-table.ts`. It will output the file that was created, but the file was not migrated so we need to run that next.

Run the migrations so that the changes are made to your database.

```zsh
yarn mikro-orm migration:up

# or you can use the script from package.json

yarn migrate
```

## Troubleshooting and "Gotchas"

### Constraints being dropped and recreated

#### Problem

Extra migrations being added for constraints, something like this

```typescript
this.addSql('alter table "table" drop constraint if exists "table_type_check";');
this.addSql('alter table "table" alter column "type" type text using ("type"::text);');
this.addSql('alter table "table" add constraint "table_type_check" check ("type" in (\'stuff\'));');
```

#### Solution

Delete them from your migration before pushing.

It's a current issue with Mikro-ORM that is being addressed in the next version.

Ref: https://github.com/mikro-orm/mikro-orm/issues/1602
