import { put } from '../../../src/schema/user';

describe('user put schema', () => {
  it('validates user correctly', () => {
    expect(
      put.safeParse({
        firstName: 'John',
        lastName: 'Doe',
      }).success,
    ).toBe(true);

    expect(
      put.safeParse({
        firstName: 'John',
      }).success,
    ).toBe(false);

    expect(
      put.safeParse({
        lastName: 'Doe',
      }).success,
    ).toBe(false);
  });

  it('validates string length correctly', () => {
    expect(
      put.safeParse({
        firstName: 'J',
        lastName: 'Doe',
      }).success,
    ).toBe(false);

    expect(
      put.safeParse({
        firstName: Array(55).fill('J'),
        lastName: 'Doe',
      }).success,
    ).toBe(false);
  });
});
