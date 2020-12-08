import 'jest';
import { getActivePlatform, SupportedPlatform } from '../../common';

describe('common getActivePlatform', () => {
  beforeEach(() => {
    process.env.PLATFORM_USED = '';
  });

  it('returns SupportedPlatform when env.PLATFORM_USED is a valid platform', () => {
    const [platform] = Object.keys(SupportedPlatform);
    process.env.PLATFORM_USED = platform;

    expect(getActivePlatform()).toEqual(platform);
  });

  it('throws an error when env.PLATFORM_USED is an invalid platform', () => {
    process.env.PLATFORM_USED = 'nothing';

    expect(getActivePlatform).toThrowError(`Unknown platform, specify PLATFORM_USED to be one of [${Object.keys(SupportedPlatform).join(', ')}]`);
  });
});
