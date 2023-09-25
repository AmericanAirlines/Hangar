import { v4 } from 'uuid';
import { Schema } from '../../../src';

describe('Post Schema', () => {
  it('should merge correctly with commonSchema', () => {
    // const mergedSchema = commonSchema.merge(post);
    expect(
      Schema.judge.post.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });
});
