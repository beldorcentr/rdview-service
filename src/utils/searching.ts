import { Photo } from '../interfaces';
import { distanceBetweenCoords } from './distance';

export function getClosestPhotoByCoords(photos: Photo[], lat: number, lon: number): Photo {
  return photos.reduce((acc, curr) => {
    return distanceBetweenCoords(lat, lon, curr.lat, curr.lon) >
      distanceBetweenCoords(lat, lon, acc.lat, acc.lon) ?
        acc :
        curr;
  });
}

export function getClosestPhotoByKm(photos: Photo[], km: number): Photo {
  return photos.reduce((acc, curr) => {
    return Math.abs(curr.km - km) > Math.abs(acc.km - km) ?
      acc :
      curr;
  });
}
