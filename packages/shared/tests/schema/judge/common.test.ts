import { v4 } from 'uuid';
import { commonSchema } from '../../../src/schema/judge/common';

describe('Judge put/post common schema', () => {
  it('validates judge correctly', () => {
    expect(
      commonSchema.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });

  it('fails on an incorrect uuid', () => {
    // one character long(37)
    expect(
      commonSchema.safeParse({
        inviteCode: `${v4()} - junk`,
      }).success,
    ).toBe(false);

    // incorrect type
    expect(
      commonSchema.safeParse({
        inviteCode: 45,
      }).success,
    ).toBe(false);
  });
});
