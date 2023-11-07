import { criteriaScore } from '../../../src/schema/criteriaScore';

describe('criteriaScore schema', () => {
  it('validates a valid object', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: 0,
    });
    expect(result.success).toEqual(true);
  });

  it('validates string scores', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: '1',
    });
    expect(result.success).toEqual(true);
    if (result.success) {
      expect(result.data.score).toEqual(1);
    }
  });

  it('truncates decimal values in numbers', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: 1.2,
    });
    expect(result.success).toEqual(true);
    if (result.success) {
      expect(result.data.score).toEqual(1);
    }
  });

  it('truncates decimal values in strings', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: '1.2',
    });
    expect(result.success).toEqual(true);
    if (result.success) {
      expect(result.data.score).toEqual(1);
    }
  });

  it('invalidates non-number strings', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: 'Fake number',
    });
    expect(result.success).toEqual(false);
  });

  it('invalidates an empty string', () => {
    const result = criteriaScore.safeParse({
      criteria: '123',
      score: '',
    });
    expect(result.success).toEqual(false);
    if (!result.success) {
      // eslint-disable-next-line no-underscore-dangle
      expect(result.error.format().score?._errors).toEqual(
        expect.arrayContaining([expect.stringMatching('Must be an integer value')]),
      );
    }
  });
});
