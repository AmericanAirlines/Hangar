import { onboarding } from '../../src/api/onboarding';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
describe('onboarding handler', () => {
  it('throws a 400 if any onboarding fields are not provided', async () => {
    const handler = testHandler(onboarding);
    await handler.post('').send({}).expect(400);
  });

  it('throws a 400 if a non-edu email is provided', async () => {
    const handler = testHandler(onboarding);
    await handler
      .post('')
      .send({
        name: 'Hello, fellow students',
        email: 'beingoldiscool@notaschool.com',
      })
      .expect(400);
  });

  it('uses the provided values to make a new user', async () => {
    const mockUserId = '123';
    const handler = testHandler((req, _res, next) => {
      req.user = {
        profile: {
          id: mockUserId,
        },
      } as any;
      next();
    }, onboarding);
    const mockOnboardingData = {
      name: 'Someone Cool',
      email: 'someone.cool@gmail.edu',
    };
    handler.entityManager.persistAndFlush.mockResolvedValueOnce();

    await handler.post('').send(mockOnboardingData).expect(200);

    expect(handler.entityManager.persistAndFlush).toBeCalledWith(
      expect.objectContaining({
        ...mockOnboardingData,
        authId: mockUserId,
      }),
    );
  });

  it('throws a 500 if something goes wrong saving the new user', async () => {
    const handler = testHandler((req, _res, next) => {
      req.user = {
        profile: {
          id: '123',
        },
      } as any;
      next();
    }, onboarding);

    handler.entityManager.persistAndFlush.mockRejectedValueOnce(new Error('Not today!'));

    await handler
      .post('')
      .send({
        name: 'Name',
        email: 'email@school.edu',
      })
      .expect(500);
    expect(loggerErrorSpy).toBeCalledTimes(1);
  });
});
