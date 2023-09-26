import { v4 } from 'uuid';
import { post } from '../../../src/schema/judge';

describe('post schema', () => {
  it('should merge correctly with commonSchema', () => {
    expect(
      post.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });
});
