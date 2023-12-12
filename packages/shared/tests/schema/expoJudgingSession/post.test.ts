import { Schema } from '../../../src';

describe('expoJudgingSession post schema', () => {
  it('validates expoJudgingSession with array of projectIds correctly', () => {
    expect(Schema.expoJudgingSession.post.safeParse({ projectIds: ['1', '2'] }).success).toBe(true);
  });
});
