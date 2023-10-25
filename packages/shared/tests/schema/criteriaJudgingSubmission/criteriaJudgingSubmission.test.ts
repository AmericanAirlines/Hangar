import { post } from '../../../src/schema/criteriaJudgingSubmission';

describe('criteriaJudgingSubmission POST schema', () => {
  it('validates a valid object', () => {
    const result = post.safeParse({
      project: '123',
      criteriaJudgingSession: '456',
      scores: [
        {
          score: 2,
          criteria: '789',
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
