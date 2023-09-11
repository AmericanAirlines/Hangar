import { v4 } from 'uuid';
import { Schema } from '../../../src';

describe('judge post schema', () => {
  it('validates judge correctly', () => {
    expect(
      Schema.judge.post.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });

  it('fails on incorrect uuid', () => {
    // one character long (37)
    expect(
      Schema.judge.post.safeParse({
        inviteCode: `${v4()}-junk`,
      }).success,
    ).toBe(false);

    // incorrect type
    expect(
      Schema.judge.post.safeParse({
        inviteCode: 45,
      }).success,
    ).toBe(false);
  });
});
