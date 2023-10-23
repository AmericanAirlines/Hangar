import { z } from 'zod';
import { post } from '../../../src/schema/criteriaJudgingSession';
import { validCriteria } from '../criteria/criteria.test';

export const validCriteriaJudgingSession: z.infer<typeof post> = {
  title: 'Some Criteria',
  description: 'A criteria that has a purpose',
  criteriaList: [{ ...validCriteria }],
};

describe('criteriaJudgingSession', () => {
  it('validates a correct object', () => {
    const result = post.safeParse({ ...validCriteriaJudgingSession });
    expect(result.success).toBe(true);
  });

  describe('invalid parsing', () => {
    it('rejects a missing title', () => {
      const { title, ...invalidCriteriaJudgingSession } = validCriteriaJudgingSession;
      const result = post.safeParse(invalidCriteriaJudgingSession);
      expect(result.success).toBe(false);
    });

    it('rejects missing criteria', () => {
      const result = post.safeParse({ ...validCriteriaJudgingSession, criteriaList: [] });
      expect(result.success).toBe(false);
    });
  });
});
