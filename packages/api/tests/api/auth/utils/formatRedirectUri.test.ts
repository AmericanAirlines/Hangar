import { Config } from '@hangar/shared';
import { mockEnv } from '../../../testUtils/mockEnv';
import { formatRedirectUri } from '../../../../src/api/auth/utils/formatRedirectUri';

describe('formatRedirectUri', () => {
  it('uses a returnTo if provided', () => {
    const baseUrl = 'abc';
    mockEnv({ baseUrl });
    const returnTo = '/api/health';
    const redirectUri = formatRedirectUri({ returnTo });
    const encodedQueryValue = encodeURIComponent(returnTo);
    expect(redirectUri).toEqual(
      `${baseUrl}/api/auth/callback/${Config.Auth.method}/?${Config.global.authReturnUriParamName}=${encodedQueryValue}`,
    );
  });

  it('skips the returnTo if omitted', () => {
    const baseUrl = 'abc';
    mockEnv({ baseUrl });
    const redirectUri = formatRedirectUri();
    expect(redirectUri).toEqual(`${baseUrl}/api/auth/callback/${Config.Auth.method}/`);
  });

  it('skips the returnTo if empty', () => {
    const baseUrl = 'abc';
    mockEnv({ baseUrl });
    const redirectUri = formatRedirectUri({ returnTo: '' });
    expect(redirectUri).toEqual(`${baseUrl}/api/auth/callback/${Config.Auth.method}/`);
  });

  it('excludes a base url if it is not set', () => {
    mockEnv({ baseUrl: undefined });
    const redirectUri = formatRedirectUri({ returnTo: '' });
    expect(redirectUri).toEqual(`/api/auth/callback/${Config.Auth.method}/`);
  });
});
