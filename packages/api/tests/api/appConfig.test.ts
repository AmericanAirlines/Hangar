import { Handler } from 'express';
import { appConfig } from '../../src/api/appConfig';
import { AppConfig } from '../../src/entities/AppConfig';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const mockUser = { id: 'mocked', isAdmin: true } as User;

jest.mock('../../src/middleware/populateUser.ts', () => ({
  populateUser: jest.fn(
    (): Handler => (req, _res, next) => {
      req.userEntity = mockUser as User;
      next();
    },
  ),
}));

const mockAppConfigItems = [
  {
    key: 'config one',
    value: 'one',
  },
  {
    key: 'config two',
    value: 'two',
  },
];

const authErrMsg = 'only admins have permission to access this endpoint!';
const newConfigItem = { key: 'config three', value: 'three' };

describe('/appConfig', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockUser.isAdmin = true;
    mockAppConfigItems[0].value = 'one';
  });

  it('successfully returns all AppConfig items', async () => {
    const handler = testHandler(appConfig);
    handler.entityManager.find.mockResolvedValueOnce(mockAppConfigItems);
    const { body } = await handler.get('/').expect(200);
    expect(body).toEqual(mockAppConfigItems);
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      AppConfig,
      {},
      { orderBy: { key: 'ASC' } },
    );
  });

  it('returns a 403 when the user is not an admin and attempts to get config values', async () => {
    mockUser.isAdmin = false;
    const handler = testHandler(appConfig);
    handler.entityManager.find.mockResolvedValueOnce(mockAppConfigItems);
    const { text } = await handler.get('/').expect(403);
    expect(text).toEqual(authErrMsg);
  });

  it('returns a 500 when there is an issue with fetching all AppConfig items', async () => {
    const handler = testHandler(appConfig);
    const errMsg = 'There was an issue fetching the list of config items';
    handler.entityManager.find.mockRejectedValueOnce('err');
    const { text } = await handler.get('/').expect(500);
    expect(text).toEqual(errMsg);
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('successfully updates a specified AppConfig item', async () => {
    const handler = testHandler(appConfig);
    handler.entityManager.findOne.mockResolvedValueOnce(mockAppConfigItems[0]);
    await handler
      .put('/')
      .send({ key: mockAppConfigItems[0].key, value: newConfigItem.value })
      .set({ 'Content-Type': 'application/json' })
      .expect(200);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(AppConfig, { key: 'config one' });
    expect(mockAppConfigItems[0].value).toEqual(newConfigItem.value);
    expect(handler.entityManager.persistAndFlush).toHaveBeenCalledTimes(1);
  });

  it('will not update a specified AppConfig item if it does not exist and will return a 400', async () => {
    const handler = testHandler(appConfig);
    const userErrMsg = 'The specified config item does not exist';
    handler.entityManager.findOne.mockResolvedValueOnce(null);
    const { text } = await handler
      .put('/')
      .send({ key: mockAppConfigItems[0].key, value: newConfigItem.value })
      .set({ 'Content-Type': 'application/json' })
      .expect(400);
    expect(text).toEqual(userErrMsg);
    expect(handler.entityManager.persistAndFlush).not.toHaveBeenCalled();
  });

  it('returns a 403 when the user is not an admin and attempts to edit config values', async () => {
    mockUser.isAdmin = false;
    const handler = testHandler(appConfig);
    handler.entityManager.findOne.mockResolvedValueOnce(mockAppConfigItems);
    const { text } = await handler
      .put('/')
      .send({ key: mockAppConfigItems[0].key, value: newConfigItem.value })
      .set({ 'Content-Type': 'application/json' })
      .expect(403);
    expect(text).toEqual(authErrMsg);
  });

  it('returns a 500 when there is an issue with fetching a specific config item', async () => {
    const handler = testHandler(appConfig);
    const errMsg = 'There was an issue editing a config item';
    handler.entityManager.findOne.mockRejectedValueOnce('err');
    const { text } = await handler
      .put('/')
      .send({ key: mockAppConfigItems[0].key, value: newConfigItem.value })
      .set({ 'Content-Type': 'application/json' })
      .expect(500);
    expect(text).toEqual(errMsg);
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('successfully creates a specified AppConfig item', async () => {
    const handler = testHandler(appConfig);
    await handler
      .post('/')
      .send(newConfigItem)
      .set({ 'Content-Type': 'application/json' })
      .expect(200);
    expect(handler.entityManager.persistAndFlush).toHaveBeenCalledTimes(1);
  });

  it('returns a 403 when the user is not an admin and attempts to create a new AppConfig item', async () => {
    mockUser.isAdmin = false;
    const handler = testHandler(appConfig);
    const { text } = await handler
      .post('/')
      .send(newConfigItem)
      .set({ 'Content-Type': 'application/json' })
      .expect(403);
    expect(text).toEqual(authErrMsg);
  });

  it('returns a 500 when there is an issue with saving a new config item', async () => {
    const handler = testHandler(appConfig);
    const errMsg = 'There was an issue adding a new config item';
    handler.entityManager.persistAndFlush.mockRejectedValueOnce('err');
    const { text } = await handler
      .post('/')
      .send(newConfigItem)
      .set({ 'Content-Type': 'application/json' })
      .expect(500);
    expect(text).toEqual(errMsg);
    expect(loggerSpy).toBeCalledTimes(1);
  });
});
