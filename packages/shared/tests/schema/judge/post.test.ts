import { v4 } from 'uuid';
import { Schema } from '../../../src';
import { commonSchema } from '../../../src/schema/judge';

describe('validate post schema', () => {
  it(' checks fo', () => {
    const mergedSchema = commonSchema.merge(Schema.judge.post);
    expect(
      mergedSchema.safeParse({
        inviteCode: `${v4()}`,
      }).success,
    ).toBe(true);
  });
});
