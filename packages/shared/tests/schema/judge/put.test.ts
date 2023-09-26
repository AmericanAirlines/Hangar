import { v4 } from 'uuid';
import { put } from '../../../src/schema/judge';

describe('put schema', () => {
  it('should merge correctly with commonSchema', () => {
    expect(
      put.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });
});
