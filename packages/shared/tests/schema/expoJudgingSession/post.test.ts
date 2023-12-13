import { Schema } from '../../../src';

describe('expoJudgingSession post schema', () => {
  it('validates expoJudgingSession with array of projectIds correctly', () => {
    expect(Schema.expoJudgingSession.post.safeParse({ projectIds: ['1', '2'] }).success).toBe(true);
  });

  it('invalidates an empty array and a missing projectIds array', () => {
    expect(Schema.expoJudgingSession.post.safeParse({ projectIds: [] }).success).toBe(false);
    expect(Schema.expoJudgingSession.post.safeParse({}).success).toBe(false);
  });
});
