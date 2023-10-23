import { z } from 'zod';
import { criteria } from '../../../src/schema/criteria';

export const validCriteria: z.infer<typeof criteria> = {
  title: 'Some Criteria',
  description: 'A criteria that has a purpose',
  weight: 0.3,
  scaleMin: 0,
  scaleMax: 3,
  scaleDescription: '0 = bad, 3 = good',
};

describe('criteria', () => {
  it('validates a correct object', () => {
    const result = criteria.safeParse({ ...validCriteria });
    expect(result.success).toBe(true);
  });

  describe('invalid parsing', () => {
    it('rejects a missing title', () => {
      const { title, ...invalidCriteria } = validCriteria;
      const result = criteria.safeParse(invalidCriteria);
      expect(result.success).toBe(false);
    });
  });
});
