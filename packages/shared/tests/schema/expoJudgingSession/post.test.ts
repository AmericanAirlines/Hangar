import { Schema } from '../../../src';

describe('expoJudgingSession post schema', () => {
  it('validates expoJudgingSession with empty object correctly', () => {
    expect(Schema.expoJudgingSession.post.safeParse({}).success).toBe(true);
  });

  it('fails on non-empty object', () => {
    const testResult = Schema.expoJudgingSession.post.safeParse({
      something: 'anything',
    }).success;
    expect(testResult).toBe(false);
  });
});
