# Mono-Repository

## Adding a New Package

1. Create a folder in `packages`

2. Setup the folder as if it was it's own project

   > When installing dependencies, make sure to use `yarn` so they are installed correctly in the workspace

3. Add the package to the `folders` array in the `.code-workspace` file

   ```json
   {
     "folders": [
       {
         "name": "root",
         "path": "."
       },
       { "path": "packages/api" },
       { "path": "packages/web" } // <- You can copy/paste this line and update the path
     ],
     ...
   ```

4. Add a new **`COPY`** command to the `Dockerfile` for the `package.json` file

   ```Dockerfile
   FROM node:14
   WORKDIR /usr/src/app

   COPY yarn.lock package.json ./
   COPY packages/api/package.json packages/api/package.json
   COPY packages/web/package.json packages/web/package.json # <- You can copy/paste this line and update the path

   ...
   ```

## Troubleshooting

### I'm not seeing the package folder in VSCode

Check the `.code-workspace` file, make sure it's been included in the `folders` array. (Step 3 above)

### My package is not found when when building the Docker image

If you are seeing something like this, then make sure the path to copy the `package.json` has been updated. (Step 4 above)

```bash
 > [ 6/10] RUN yarn install --frozen-lockfile:
#9 1.570 error Couldn't find package "@x/something@*" required by "@x/api@0.1.0" on the "npm" registry.
#9 1.570 info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
#9 1.572 Error: Couldn't find package "@x/something@*" required by "@x/web@0.1.0" on the "npm" registry.
#9 1.572     at MessageError.ExtendableBuiltin (/opt/yarn-v1.22.5/lib/cli.js:721:66)
#9 1.572     at new MessageError (/opt/yarn-v1.22.5/lib/cli.js:750:123)
#9 1.572     at PackageRequest.<anonymous> (/opt/yarn-v1.22.5/lib/cli.js:36539:17)
#9 1.572     at Generator.throw (<anonymous>)
#9 1.572     at step (/opt/yarn-v1.22.5/lib/cli.js:310:30)
#9 1.572     at /opt/yarn-v1.22.5/lib/cli.js:323:13
#9 1.572     at processTicksAndRejections (internal/process/task_queues.js:95:5)
```
