import express from 'express';
import { Config, ConfigValue } from '../entities/config';
import logger from '../logger';
import { DefaultConfigKeys, DefaultConfigValues, defaultConfig, KnownConfig } from '../types/config';

export const config = express.Router();

config.get('/', async (req, res) => {
  try {
    const configItems: Config[] = await Config.find();

    type DefaultConfigTuples = Array<[DefaultConfigKeys, DefaultConfigValues]>;
    for (const [key, value] of Object.entries(defaultConfig) as DefaultConfigTuples) {
      if (!configItems.find((configItem: Config) => configItem.key === key)) {
        configItems.push(new Config(key, value));
      }
    }
    res.send(configItems.sort((a, b) => a.key.localeCompare(b.key)));
  } catch (err) {
    /* istanbul ignore next */
    res.status(500).send('Something went wrong sending an update to users; check the logs for more details');
    /* istanbul ignore next */
    logger.error(err);
  }
});

config.post('/', async (req, res) => {
  const { configKey, configValue } = req.body;

  if (!configKey || !configKey.trim() || configValue === undefined) {
    res.status(400).send("Property 'configKey' and 'configValue' are required");
    return;
  }

  try {
    let configItem = await Config.findOne({ key: configKey });
    if (!configItem) {
      configItem = new Config(configKey, configValue);
    } else {
      configItem.value = configValue;
    }

    await configItem.save();
    res.send(configItem);
  } catch (err) {
    /* istanbul ignore next */
    res.status(500).send('Something went wrong sending an update to users; check the logs for more details');
    /* istanbul ignore next */
    logger.error(err);
  }
});

config.post('/bulk', async (req, res) => {
  const { inputConfig } = req.body;
  try {
    await Promise.all(
      Object.entries(inputConfig).map(([key, value]) => {
        const configToSave = new Config(key as KnownConfig, value as ConfigValue);
        return configToSave.save();
      }),
    );

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Some items were not inserted, check logs for more information');
  }
});
