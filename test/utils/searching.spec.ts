import { getClosestViewByCoords, getClosestViewByKm } from '../../src/utils';
import { views } from '../moqs/views';

describe('getClosestPhotoByCoords', () => {
  it('should find photo when searching by photo coords', () => {
    views.forEach(view => {
      expect(getClosestViewByCoords(views, view.lat, view.lon)).toEqual(view);
    });
  });
});

describe('getClosestPhotoByKm', () => {
  it('should find photo when searching by photo km', () => {
    views.forEach(view => {
      expect(getClosestViewByKm(views, view.rdKm)).toEqual(view);
    });
  });
});
