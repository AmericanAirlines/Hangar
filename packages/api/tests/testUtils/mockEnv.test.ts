import { env } from '../../src/env';
import { mockEnv } from './mockEnv';

describe('mockEnv', () => {
  it('uses default values', () => {
    expect(env.sessionSecret).toBe('tacocat');
  });

  it('correctly overrides default values', () => {
    const myOtherPalindrome = 'race car';
    mockEnv({ sessionSecret: myOtherPalindrome, nodeEnv: 'outer space' });
    expect(env.sessionSecret).toBe(myOtherPalindrome);
  });

  it('resets between tests', () => {
    // NOTE: This test must execute last
    // Normally a test should never do this
    expect(env.sessionSecret).toBe('tacocat');
    expect(env.nodeEnv).toBe(undefined);
  });
});
