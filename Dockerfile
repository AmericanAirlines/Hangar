FROM node:14
WORKDIR /usr/src/app

COPY yarn.lock package.json ./
COPY packages/api/package.json packages/api/package.json
COPY packages/web/package.json packages/web/package.json

# Install all dependencies
RUN yarn install --frozen-lockfile

ENV NODE_ENV production
ENV PORT 8080

COPY . .

RUN yarn build

# Install again to remove devDependencies becasue NODE_ENV is set to production
RUN yarn install --frozen-lockfile

# Remove src files

RUN chmod +x ./entrypoint.sh

EXPOSE 8080
ENTRYPOINT [ "./entrypoint.sh" ]
