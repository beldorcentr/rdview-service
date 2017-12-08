import { dateParser } from '../../src/utils';

describe('dateParser', () => {
  it('should convert string with date to date object', () => {
    const dateString = new Date().toISOString();
    const date = dateParser('', dateString);
    expect(date).toEqual(new Date(dateString));
  });

  it('should return same value if value is not date', () => {
    const value = 42;
    const returnedValue = dateParser('', value);
    expect(returnedValue).toBe(value);
  });
});
