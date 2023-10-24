import { criteriaScore } from '../../../src/schema/criteriaScore';

describe('criteriaScore schema', () => {
  it('validates a valid object', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: 2,
    });
    expect(result.success).toEqual(true);
  });
});
