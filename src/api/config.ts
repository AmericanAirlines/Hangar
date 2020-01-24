import express from 'express';
import { Config } from '../entities/config';
import logger from '../logger';

export const config = express.Router();

config.get('/', async (req, res) => {
  const { configKey } = req.query;

  if (!configKey || !configKey.trim()) {
    res.status(400).send("Property 'configKey' must contain content");
    return;
  }

  try {
    const configItem = await Config.findOne({ key: configKey });
    res.send(configItem);
  } catch (err) {
    res.status(500).send('Something went wrong sending an update to users; check the logs for more details');
    logger.error(err);
  }
});

config.post('/', async (req, res) => {
  const { configKey, configValue } = req.body;

  if (!configKey || !configKey.trim() || !configValue || !configValue.trim()) {
    res.status(400).send("Property 'configKey' and 'configKey' are required");
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
    res.status(500).send('Something went wrong sending an update to users; check the logs for more details');
    logger.error(err);
  }
});
