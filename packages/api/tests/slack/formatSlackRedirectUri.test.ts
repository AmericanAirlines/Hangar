import { Config } from '@hangar/shared';
import { formatSlackRedirectUri } from '../../src/slack/formatSlackRedirectUri';
import { mockEnv } from '../testUtils/mockEnv';

describe('formatSlackRedirectUri', () => {
  it('uses a returnTo if provided', () => {
    const baseUrl = 'abc';
    mockEnv({ baseUrl });
    const returnTo = '/api/health';
    const redirectUri = formatSlackRedirectUri({ returnTo });
    const encodedQueryValue = encodeURIComponent(returnTo);
    expect(redirectUri).toEqual(
      `${baseUrl}/api/auth/callback/slack?${Config.global.authReturnUriParamName}=${encodedQueryValue}`,
    );
  });

  it('skips the returnTo if omitted', () => {
    const baseUrl = 'abc';
    mockEnv({ baseUrl });
    const redirectUri = formatSlackRedirectUri();
    expect(redirectUri).toEqual(`${baseUrl}/api/auth/callback/slack`);
  });

  it('skips the returnTo if empty', () => {
    const baseUrl = 'abc';
    mockEnv({ baseUrl });
    const redirectUri = formatSlackRedirectUri({ returnTo: '' });
    expect(redirectUri).toEqual(`${baseUrl}/api/auth/callback/slack`);
  });
});
