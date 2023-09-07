import { Schema } from '../../../src';

describe('user put schema', () => {
  it('validates user correctly', () => {
    expect(
      Schema.user.put.safeParse({
        firstName: 'John',
        lastName: 'Doe',
      }).success,
    ).toBe(true);

    expect(
      Schema.user.put.safeParse({
        firstName: 'John',
      }).success,
    ).toBe(false);

    expect(
      Schema.user.put.safeParse({
        lastName: 'Doe',
      }).success,
    ).toBe(false);
  });

  it('trims spaces correctly', () => {
    const result = Schema.user.put.safeParse({
      firstName: ' John ',
      lastName: ' Doe ',
    });
    if (!result.success) throw new Error('Validation failed');

    expect(result.data.firstName).toBe('John');
    expect(result.data.lastName).toBe('Doe');
  });

  it('validates string length correctly', () => {
    expect(
      Schema.user.put.safeParse({
        firstName: 'J',
        lastName: 'Doe',
      }).success,
    ).toBe(false);

    expect(
      Schema.user.put.safeParse({
        firstName: Array(Schema.user.PutValidation.MAX_NAME_LENGTH + 1).fill('J'),
        lastName: 'Doe',
      }).success,
    ).toBe(false);
  });
});
