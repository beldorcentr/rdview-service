import { Photo } from '../../src/interfaces';
import { getClosestPhotoByCoords, getClosestPhotoByKm } from '../../src/utils';
import { photos } from '../moqs/photos';

describe('getClosestPhotoByCoords', () => {
  it('should find photo when searching by photo coords', () => {
    photos.forEach(photo => {
      expect(getClosestPhotoByCoords(photos, photo.lat, photo.lon)).toEqual(photo);
    });
  });
});

describe('getClosestPhotoByKm', () => {
  it('should find photo when searching by photo km', () => {
    photos.forEach(photo => {
      expect(getClosestPhotoByKm(photos, photo.km)).toEqual(photo);
    });
  });
});
