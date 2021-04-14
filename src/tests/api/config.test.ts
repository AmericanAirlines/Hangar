import 'jest';
import supertest from 'supertest';
import { Config } from '../../entities/config';
import { env } from '../../env';
import { KnownConfig } from '../../types/config';

jest.mock('../../discord');
jest.mock('../../env', () => {
  const realEnv = jest.requireActual('../../env');
  return {
    env: {
      ...realEnv,
      adminSecret: 'Secrets are secretive',
      slackBotToken: 'junk token',
      slackSigningSecret: 'another junk token',
    },
  };
});

/* eslint-disable @typescript-eslint/no-var-requires, global-require */

xdescribe('api/judging', () => {
  // it('is protected by admin middleware', (done) => {
  //   // Hide error output for unauth'd request
  //   jest.mock('../../logger');

  //   const { app } = require('../../app');
  //   supertest(app)
  //     .get('/api/config')
  //     .set({
  //       Authorization: "YOU DIDN'T SAY THE MAGIC WORD!",
  //     })
  //     .expect(401, done);
  // });

  // it('a GET will return all toggles', async () => {
  //   const configKey = 'something';
  //   const configValue = 'somehow';

  //   const item = new Config(configKey as KnownConfig, configValue);
  //   await item.save();

  //   const { app } = require('../../app');
  //   const result = await supertest(app)
  //     .get('/api/config')
  //     .set({
  //       Authorization: env.adminSecret,
  //     })
  //     .expect(200);

  //   expect(result.body.length).toBe(1);
  //   const config = result.body[0];
  //   expect(config.key).toEqual(configKey);
  //   expect(config.value).toEqual(configValue);
  // });

  // it('creating a new config item will succeed', async () => {
  //   const { app } = require('../../app');
  //   const configKey = 'something';
  //   const configValue = 'somehow';

  //   const result = await supertest(app)
  //     .post('/api/config')
  //     .set({
  //       Authorization: env.adminSecret,
  //     })
  //     .send({ configKey, configValue })
  //     .expect(200);

  //   expect(result.body.key).toEqual(configKey);
  //   expect(result.body.value).toEqual(configValue);
  // });

  // it('updating a new config item will succeed', async () => {
  //   const { app } = require('../../app');
  //   const configKey = 'something';
  //   const configValue = 'somehow';
  //   const newConfigValue = 'somewhere';

  //   const item = new Config(configKey as KnownConfig, configValue);
  //   await item.save();

  //   const result = await supertest(app)
  //     .post('/api/config')
  //     .set({
  //       Authorization: env.adminSecret,
  //     })
  //     .send({ configKey, configValue: newConfigValue })
  //     .expect(200);

  //   expect(result.body.key).toEqual(configKey);
  //   expect(result.body.value).toEqual(newConfigValue);
  // });

  // it('creating a new config item without required body items will fail', (done) => {
  //   const { app } = require('../../app');
  //   supertest(app)
  //     .post('/api/config')
  //     .set({
  //       Authorization: env.adminSecret,
  //     })
  //     .expect(400, done);
  // });
});
