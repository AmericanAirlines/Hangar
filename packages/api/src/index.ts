/* istanbul ignore file */
import express from 'express';
import { web } from '@hangar/web';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import session from 'express-session';
import { env } from './env';
import { api } from './api';
import { initDatabase } from './database';
import logger from './logger';
import { User } from './entities/User';

const app = express();
const port = Number(env.port ?? '') || 3000;
const dev = env.nodeEnv === 'development';

void (async () => {
  const orm = await initDatabase();

  app.use(session({ secret: env.sessionSecret }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new DiscordStrategy(
      {
        clientID: env.discordClientId,
        clientSecret: env.discordClientSecret,
        callbackURL: `${env.appUrl}/auth/discord/callback`,
        scope: ['identify', 'email', 'guilds'],
      },
      async (accessToken, refreshToken, profile, done) => {
        const entityManager = orm.em.fork();
        const count = await entityManager.count(User, { authId: profile.id });

        if (count === 0) {
          const newUser = new User({ authId: profile.id, name: profile.username });
          await entityManager.persistAndFlush(newUser);
        }

        const isMemberOfEventGuild = (profile.guilds ?? []).map((guild) => guild.id).includes(env.discordGuildId);

        if (guildIds.length) {
          done(null, { profile, accessToken, refreshToken });
        } else {
          done(
            new Error('Please make sure your are a member of the Discord server for this event'),
          );
        }
      },
    ),
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });

  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/discord/callback', passport.authenticate('discord'), (req, res) => {
    res.redirect('/app');
  });
  app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => {
      req.logOut();
      res.redirect('/');
    });
  });

  app.use(
    '/api',
    (req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    },
    (req, _res, next) => {
      req.entityManager = orm.em.fork();

      next();
    },
    api,
  );

  const webHandler = await web({ dev });

  app.all(
    '/app',
    (req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/discord');
      }
    },
    webHandler,
  );
  app.all('*', webHandler);
})()
  .then(() => {
    app.listen(port, () => {
      logger.info(`🚀 Listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logger.crit('An error happened during app start', err);
  });
