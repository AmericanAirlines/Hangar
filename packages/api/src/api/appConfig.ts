import { Router } from 'express';
import logger from '../logger';
import { AppConfig } from '../entities/AppConfig';
import { populateUser } from '../middleware/populateUser';

export const appConfig = Router();
appConfig.use(populateUser());

appConfig.get('/', async (req, res) => {
  const user = req.userEntity;
  if (!user.isAdmin) {
    res.sendStatus(403);
    return;
  }

  try {
    const configItems = await req.entityManager.find(AppConfig, {}, { orderBy: { key: 'ASC' } });
    res.status(200).send(configItems);
  } catch (error) {
    const errorMsg = 'There was an issue fetching the list of config items';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});

appConfig.put('/', async (req, res) => {
  const user = req.userEntity;
  const { key, value } = req.body;

  if (!user.isAdmin) {
    res.sendStatus(403);
    return;
  }

  try {
    const selectedConfigItem = new AppConfig({ key, value });
    await req.entityManager.persistAndFlush(selectedConfigItem);
    res.send(200);
    return;
  } catch (error) {
    const errorMsg = 'There was an issue editing/creating a config item';
    logger.error(`${errorMsg}: `, error);
    res.status(500).send(errorMsg);
  }
});
