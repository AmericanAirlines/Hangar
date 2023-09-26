import { v4 } from 'uuid';
import { put } from '../../../src/schema/judge';

describe('put schema', () => {
  it('validates an updated judge correctly', () => {
    expect(
      put.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });
});
