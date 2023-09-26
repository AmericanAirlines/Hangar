import { v4 } from 'uuid';
import { post } from '../../../src/schema/judge';

describe('post schema', () => {
  it('validates a new judge correctly', () => {
    expect(
      post.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });
});
