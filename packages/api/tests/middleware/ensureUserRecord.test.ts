import { User } from '../../src/entities/User';
import { ensureUserRecord } from '../../src/middleware/ensureUserRecord';
import { testHandler } from '../testUtils/testHandler';
import { createTestRouter } from '../testUtils/createTestRouter';

const mockEntityManager = {
  count: jest.fn(),
};

describe('Ensure User Record middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes through when there is no session', async () => {
    const router = createTestRouter((req, _res, next) => {
      req.user = undefined;
      next();
    }, ensureUserRecord({ entityManager: mockEntityManager as any, redirectUrl: '' }));

    await testHandler(router).get('/').expect(200);
  });

  it('passes through when onboarding is already completed', async () => {
    const router = createTestRouter((req, _res, next) => {
      req.user = {
        onboardingComplete: true,
      } as any;
      next();
    }, ensureUserRecord({ entityManager: mockEntityManager as any, redirectUrl: '' }));

    expect(mockEntityManager.count).not.toHaveBeenCalled();
    await testHandler(router).get('/').expect(200);
  });

  it('passes through when the url is the same as the redirect url', async () => {
    const router = createTestRouter((req, _res, next) => {
      req.user = {
        onboardingComplete: true,
      } as any;
      next();
    }, ensureUserRecord({ entityManager: mockEntityManager as any, redirectUrl: '/' }));

    expect(mockEntityManager.count).not.toHaveBeenCalled();
    await testHandler(router).get('/').expect(200);
  });

  it('passes through when there is a session and a user entity', async () => {
    mockEntityManager.count.mockResolvedValueOnce(1);

    const mockUser: Partial<Express.User> = {
      profile: {
        id: '123123',
      },
    };

    const router = createTestRouter((req, _res, next) => {
      req.user = mockUser as any;
      next();
    }, ensureUserRecord({ entityManager: mockEntityManager as any, redirectUrl: '' }));

    await testHandler(router).get('').expect(200);

    expect(mockEntityManager.count).toHaveBeenCalledTimes(1);
    expect(mockEntityManager.count).toHaveBeenCalledWith(User, { authId: mockUser.profile!.id });

    expect(mockUser.onboardingComplete).toEqual(true);
  });

  it('redirects when there is a session, but no user entity', async () => {
    const mockRedirectUrl = '/wow';
    const mockUser: Partial<Express.User> = {
      profile: {
        id: '123123',
      },
    };
    mockEntityManager.count.mockResolvedValueOnce(0);

    const router = createTestRouter((req, _res, next) => {
      req.user = mockUser as any;
      next();
    }, ensureUserRecord({ entityManager: mockEntityManager as any, redirectUrl: mockRedirectUrl }));

    await testHandler(router).get('/').expect('Location', mockRedirectUrl).expect(302);

    expect(mockEntityManager.count).toHaveBeenCalledTimes(1);
    expect(mockEntityManager.count).toHaveBeenCalledWith(User, { authId: mockUser.profile!.id });

    expect(mockUser.onboardingComplete).toEqual(false);
  });
});
