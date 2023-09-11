import { v4 } from 'uuid';
import { Schema } from '../../../src';

describe('judgingSession post schema', () => {
  it('validates judgingSession correctly', () => {
    expect(
      Schema.judgingSession.post.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });

  it('fails on incorrect uuid', () => {
    // one character long (37)
    expect(
      Schema.judgingSession.post.safeParse({
        inviteCode: `${v4()}-junk`,
      }).success,
    ).toBe(false);

    // incorrect type
    expect(
      Schema.judgingSession.post.safeParse({
        inviteCode: 45,
      }).success,
    ).toBe(false);
  });
});
