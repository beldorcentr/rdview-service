import { uuidv4 } from '../../src/utils';

describe('uuidv4', () => {
  it('should return string id', () => {
    const id = uuidv4();
    expect(id).toBeTruthy();
    expect(id).toEqual(jasmine.any(String));
  });
});
