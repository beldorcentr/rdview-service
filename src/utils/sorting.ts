import { Passage, Photo } from '../interfaces';
import { distanceBetweenCoords } from './distance';
import { getClosestPhotoByCoords, getClosestPhotoByKm } from './searching';

export function sortPhotosByKmAsc(photos: Photo[]): Photo[] {
  return photos.sort((photo1, photo2) => {
    return photo1.km - photo2.km;
  });
}

export function sortPhotosByKmDesc(photos: Photo[]): Photo[] {
  return photos.sort((photo1, photo2) => {
    return photo2.km - photo1.km;
  });
}

export function sortPassagesByDateAsc(passages: Passage[]): Passage[] {
  return passages.sort((passage1, passage2) => {
    return passage1.date.getTime() - passage2.date.getTime();
  });
}

export function sortPassagesByDateDesc(passages: Passage[]): Passage[] {
  return passages.sort((passage1, passage2) => {
    return passage2.date.getTime() - passage1.date.getTime();
  });
}

export function sortPassagesByDistanceToKm(passages: Passage[], km: number): Passage[] {
  return passages.sort((passage1, passage2) => {
    const closestPhotoPassage1 = getClosestPhotoByKm(passage1.photos, km);
    const closestPhotoPassage2 = getClosestPhotoByKm(passage2.photos, km);

    return Math.abs(closestPhotoPassage1.km - km) -
        Math.abs(closestPhotoPassage2.km - km);
  });
}

export function sortPassagesByDistanceToCoordinates(passages: Passage[], lat: number, lon: number): Passage[] {
  return passages.sort((passage1, passage2) => {
    const closestPhotoPassage1 = getClosestPhotoByCoords(passage1.photos, lat, lon);
    const closestPhotoPassage2 = getClosestPhotoByCoords(passage2.photos, lat, lon);

    return distanceBetweenCoords(closestPhotoPassage1.lat, closestPhotoPassage1.lon, lat, lon) -
      distanceBetweenCoords(closestPhotoPassage2.lat, closestPhotoPassage2.lon, lat, lon);
  });
}
