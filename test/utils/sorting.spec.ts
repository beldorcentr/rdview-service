import { Passage, Photo } from '../../src/interfaces';
import {
  sortPassagesByDateAsc, sortPassagesByDateDesc,
  sortPassagesByDistanceToKm, sortPhotosByKmAsc, sortPhotosByKmDesc
} from '../../src/utils';
import { passages } from '../moqs/passages';
import { photos } from '../moqs/photos';

describe('sortPhotosByKm', () => {
  it('should sort photos by km asc', () => {
    const sortedByKmPhotos = sortPhotosByKmAsc(photos);
    sortedByKmPhotos.reduce((acc, curr) => {
      expect(acc.km).toBeLessThanOrEqual(curr.km);
      return curr;
    });
  });

  it('should sort photos by km desc', () => {
    const sortedByKmPhotos = sortPhotosByKmDesc(photos);
    sortedByKmPhotos.reduce((acc, curr) => {
      expect(acc.km).toBeGreaterThanOrEqual(curr.km);
      return curr;
    });
  });
});

describe('sortPassagesByDate', () => {
  it('should sort photos by date asc', () => {
    const sortedByDatePassages = sortPassagesByDateAsc(passages);
    sortedByDatePassages.reduce((acc, curr) => {
      expect(acc.date.getTime()).toBeLessThanOrEqual(curr.date.getTime());
      return curr;
    });
  });

  it('should sort photos by date desc', () => {
    const sortedByDatePassages = sortPassagesByDateDesc(passages);
    sortedByDatePassages.reduce((acc, curr) => {
      expect(acc.date.getTime()).toBeGreaterThanOrEqual(curr.date.getTime());
      return curr;
    });
  });
});
