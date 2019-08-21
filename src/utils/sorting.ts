import { Passage, View } from '../interfaces';
import { distanceBetweenCoords } from './distance';
import { getClosestViewByCoords, getClosestViewByKm } from './searching';

export function sortPhotosByKmAsc(photos: View[]): View[] {
  return photos.sort((photo1, photo2) => {
    return photo1.rdKm - photo2.rdKm;
  });
}

export function sortPhotosByKmDesc(photos: View[]): View[] {
  return photos.sort((photo1, photo2) => {
    return photo2.rdKm - photo1.rdKm;
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
    const closestPhotoPassage1 = getClosestViewByKm(passage1.views, km);
    const closestPhotoPassage2 = getClosestViewByKm(passage2.views, km);

    return Math.abs(closestPhotoPassage1.rdKm - km) -
        Math.abs(closestPhotoPassage2.rdKm - km);
  });
}

export function sortPassagesByDistanceToCoordinates(passages: Passage[], lat: number, lon: number): Passage[] {
  return passages.sort((passage1, passage2) => {
    const closestPhotoPassage1 = getClosestViewByCoords(passage1.views, lat, lon);
    const closestPhotoPassage2 = getClosestViewByCoords(passage2.views, lat, lon);

    return distanceBetweenCoords(closestPhotoPassage1.lat, closestPhotoPassage1.lon, lat, lon) -
      distanceBetweenCoords(closestPhotoPassage2.lat, closestPhotoPassage2.lon, lat, lon);
  });
}
