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

  it('validates string length correctly', () => {
    expect(
      Schema.user.put.safeParse({
        firstName: 'J',
        lastName: 'Doe',
      }).success,
    ).toBe(false);

    expect(
      Schema.user.put.safeParse({
        firstName: Array(55).fill('J'),
        lastName: 'Doe',
      }).success,
    ).toBe(false);
  });
});
