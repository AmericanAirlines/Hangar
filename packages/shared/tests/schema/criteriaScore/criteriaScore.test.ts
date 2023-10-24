import { criteriaScore } from '../../../src/schema/criteriaScore';

describe('criteriaScore schema', () => {
  it('validates a valid object', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: 0,
    });
    expect(result.success).toEqual(true);
  });
});
