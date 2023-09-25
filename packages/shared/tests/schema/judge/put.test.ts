import { v4 } from 'uuid';
import { Schema } from '../../../src';
import { commonSchema } from '../../../src/schema/judge';

describe('validate post schema', () => {
  it('should merge correctly with commonSchema', () => {
    const mergedSchema = commonSchema.merge(Schema.judge.put);
    expect(
      mergedSchema.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });
});
