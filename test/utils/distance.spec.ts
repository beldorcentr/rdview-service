import { distanceBetweenCoords } from '../../src/utils';

describe('distanceBetweenCoords', () => {

  it('should compute distance between points', () => {
    expect(distanceBetweenCoords(0, 0, 0, 2)).toEqual(2);
  });

  it('should compute 0 for same point', () => {
    expect(distanceBetweenCoords(0, 0, 0, 0)).toEqual(0);
  });
});
