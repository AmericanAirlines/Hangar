import { v4 } from 'uuid';
import { Schema } from '../../../src';

describe('validates a common schema', () => {
  it('validates judge correctly', () => {
    expect(
      Schema.judge.commonSchema.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });

  it('fails on an incorrect uuid', () => {
    // one character long(37)
    expect(
      Schema.judge.commonSchema.safeParse({
        inviteCode: `${v4()} - junk`,
      }).success,
    ).toBe(false);

    // incorrect type
    expect(
      Schema.judge.commonSchema.safeParse({
        inviteCode: 45,
      }).success,
    ).toBe(false);
  });
});
