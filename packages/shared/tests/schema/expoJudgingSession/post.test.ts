import { Schema } from '../../../src';

describe('expoJudgingSession post schema', () => {
  it('validates expoJudgingSession with empty object correctly', () => {
    expect(Schema.expoJudgingSession.post.safeParse({}).success).toBe(true);
  });
});
