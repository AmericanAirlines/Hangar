import { User } from '../../src/entities/User';
import { requireAuthAndOnboarding } from '../../src/middleware/requireAuthAndOnboarding';
import { testHandler } from '../testUtils/testHandler';
import { createTestRouter } from '../testUtils/createTestRouter';

const mockEntityManager = {
  count: jest.fn(),
};

describe('requireAuthAndOnboarding middleware', () => {
  it('redirects when there is no session', async () => {
    const router = createTestRouter((req, res, next) => {
      req.user = undefined;
      next();
    }, requireAuthAndOnboarding({ entityManager: mockEntityManager as any, onboardingUrl: '' }));

    const res = await testHandler(router).get('/').expect(302);
    expect(res.headers.location).toEqual('/auth/discord');
  });

  it('passes through when onboarding is already completed', async () => {
    const router = createTestRouter((req, _res, next) => {
      req.user = {
        onboardingComplete: true,
      } as any;
      next();
    }, requireAuthAndOnboarding({ entityManager: mockEntityManager as any, onboardingUrl: '' }));

    expect(mockEntityManager.count).not.toHaveBeenCalled();
    await testHandler(router).get('/').expect(200);
  });

  it('redirects to /app when onboarding is complete and the url matches the onboarding url', async () => {
    const router = createTestRouter((req, _res, next) => {
      req.user = {
        onboardingComplete: true,
      } as any;
      next();
    }, requireAuthAndOnboarding({ entityManager: mockEntityManager as any, onboardingUrl: '/' }));

    expect(mockEntityManager.count).not.toHaveBeenCalled();
    const res = await testHandler(router).get('/').expect(302);
    expect(res.headers.location).toEqual('/app');
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
    }, requireAuthAndOnboarding({ entityManager: mockEntityManager as any, onboardingUrl: '' }));

    await testHandler(router).get('').expect(200);

    expect(mockEntityManager.count).toHaveBeenCalledTimes(1);
    expect(mockEntityManager.count).toHaveBeenCalledWith(User, { authId: mockUser.profile!.id });

    expect(mockUser.onboardingComplete).toEqual(true);
  });

  it('redirects when there is a session, but no user entity', async () => {
    const mockOnboardingUrl = '/wow';
    const mockUser: Partial<Express.User> = {
      profile: {
        id: '123123',
      },
    };
    mockEntityManager.count.mockResolvedValueOnce(0);

    const router = createTestRouter((req, _res, next) => {
      req.user = mockUser as any;
      next();
    }, requireAuthAndOnboarding({ entityManager: mockEntityManager as any, onboardingUrl: mockOnboardingUrl }));

    await testHandler(router).get('/').expect('Location', mockOnboardingUrl).expect(302);

    expect(mockEntityManager.count).toHaveBeenCalledTimes(1);
    expect(mockEntityManager.count).toHaveBeenCalledWith(User, { authId: mockUser.profile!.id });

    expect(mockUser.onboardingComplete).toEqual(false);
  });
});
