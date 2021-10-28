import { prizes } from '../../src/api/prizes';
import { Prize } from '../../src/entities/Prize';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const mockPrizes: Partial<Prize>[] = [
  {
    name: 'First prize',
    sortOrder: 1,
    isBonus: false,
  },
  {
    name: 'Second prize',
    sortOrder: 2,
    isBonus: false,
  },
  {
    name: 'Third prize',
    sortOrder: 3,
    isBonus: true,
  },
];

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/prizes', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('successfully returns all prizes sorted by the sortOrder', async () => {
    const handler = testHandler(prizes);
    handler.entityManager.find.mockResolvedValueOnce(mockPrizes);
    const { body } = await handler.get('/').expect(200);

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'First prize',
          sortOrder: 1,
          isBonus: false,
        }),
        expect.objectContaining({
          name: 'Second prize',
          sortOrder: 2,
          isBonus: false,
        }),
        expect.objectContaining({
          name: 'Third prize',
          sortOrder: 3,
          isBonus: true,
        }),
      ]),
    );
    expect(handler.entityManager.find).toHaveBeenCalledWith(
      Prize,
      {},
      { orderBy: { isBonus: 'ASC', sortOrder: 'ASC' } },
    );
  });

  it('returns a 500 when there was an issue fetching the prizes', async () => {
    const handler = testHandler(prizes);
    handler.entityManager.find.mockRejectedValueOnce(new Error('Error has occurred'));
    const { text } = await handler.get('/').expect(500);

    expect(text).toEqual('Uh oh, looks like there was an issue fetching the list of prizes!');
    expect(loggerSpy).toBeCalledTimes(1);
  });
});
