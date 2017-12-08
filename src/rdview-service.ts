import { CurrentPosition, Passage, Photo, Road, Segment } from './interfaces';
import { PassageService } from './passage-service';
import { REQUEST_PASSAGE_DIRECTION, RoadSegmentService } from './road-segment-service';
import {
  distanceBetweenCoords, filterPassagesByDistanceToCoordinates, filterPassagesByDistanceToKm,
  getClosestPhotoByCoords, getClosestPhotoByKm, sortPassagesByDateDesc,
  sortPassagesByDistanceToKm, sortPhotosByKmAsc
} from './utils';
import { sortPassagesByDistanceToCoordinates } from './utils/sorting';

export class RdviewService {

  private passageService: PassageService;

  private isInited = false;

  private distanceToBorderInKmToStartLoadingNewSegment = .5;
  private dateDiffInMsForSamePassage = 1000 * 30;
  private rangeDiffInKmForSamePassage = .2;

  private rangeDiffInKmForClosePassagesInFindingClosest = .1;
  private rangeDiffInCoordinatesForClosePassagesInFindingClosest = .005;

  private currentPhoto: Photo;
  private currentPassage: Passage;

  private get segment(): Segment {
    return this.passageService.getSegment();
  }

  private get currentPhotoIndex(): number {
    return this.currentPassage.photos.indexOf(this.currentPhoto);
  }

  constructor(settings: { apiUrl?: string, authorization: string
      } = { apiUrl: 'https://i.centr.by/rdview', authorization: '' }) {
    this.passageService = new PassageService({
      apiUrl: settings.apiUrl,
      authorization: settings.authorization
    });
  }

  public initByRoad(roadId: number, km: number): Promise<CurrentPosition> {
    return this.passageService.initByRoad(roadId, km)
      .then(segment => {
        this.isInited = true;

        if (!segment) {
          return null;
        }

        const closePassagesToKm = filterPassagesByDistanceToKm(segment.passages,
          km, this.rangeDiffInKmForClosePassagesInFindingClosest);

        if (closePassagesToKm.length) {
          this.currentPassage = sortPassagesByDateDesc(closePassagesToKm)[0];
        } else {
          this.currentPassage = sortPassagesByDistanceToKm(segment.passages, km)[0];
        }

        this.currentPhoto = getClosestPhotoByKm(this.currentPassage.photos, km);
        return this.generateCurrentPosition(true, false);
      });
  }

  public initByCoordinates(lat: number, lon: number): Promise<CurrentPosition> {
    return this.passageService.initByCoordinates(lat, lon)
      .then(segment => {
        this.isInited = true;

        if (!segment) {
          return this.generateCurrentPosition(false, false, true);
        }

        const closePassagesToCoordinates = filterPassagesByDistanceToCoordinates(
          segment.passages, lat, lon,
          this.rangeDiffInCoordinatesForClosePassagesInFindingClosest);

        if (closePassagesToCoordinates.length) {
          this.currentPassage = sortPassagesByDateDesc(
            closePassagesToCoordinates)[0];
        } else {
          this.currentPassage = sortPassagesByDistanceToCoordinates(
            segment.passages, lat, lon)[0];
        }

        this.currentPhoto = getClosestPhotoByCoords(this.currentPassage.photos, lat, lon);
        return this.generateCurrentPosition(true, false);
      });
  }

  public getNextPhoto(): Promise<CurrentPosition> {
    this.throwIfNotInited();

    this.loadNeighbourSegmentsIfNeeded();

    // has next photo in current passage
    if (this.currentPhotoIndex < this.currentPassage.photos.length - 1) {
      this.currentPhoto = this.currentPassage.photos[this.currentPhotoIndex + 1];
      return Promise.resolve(this.generateCurrentPosition());
    }

    // case when loading segment
    if (this.passageService.loadingNextSegment) {
      return this.passageService.loadingNextSegment
        .then(() => this.getNextPhoto());
    }

    // end of current passage
    const passagesAfterCurrentPhoto = this.segment.passages
      .filter(passage => passage.photos.some(photo =>
        photo.km > this.currentPhoto.km));

    if (passagesAfterCurrentPhoto.length) {
      return this.setPassage(sortPassagesByDistanceToKm(
        passagesAfterCurrentPhoto, this.currentPhoto.km)[0].id);
    }

    // no more photo and no passages to switch
    return Promise.resolve(this.generateCurrentPosition(false, true));
  }

  public getPreviousPhoto(): Promise<CurrentPosition> {
    this.throwIfNotInited();

    this.loadNeighbourSegmentsIfNeeded();

    // has previous photo in current passage
    if (this.currentPhotoIndex > 0) {
      this.currentPhoto = this.currentPassage.photos[this.currentPhotoIndex - 1];
      return Promise.resolve(this.generateCurrentPosition());
    }

    // case when loading segment
    if (this.passageService.loadingNextSegment) {
      return this.passageService.loadingNextSegment
      .then(() => this.getPreviousPhoto());
    }

    // end of current passage
    const passagesBeforeCurrentPhoto = this.segment.passages
      .filter(passage => passage.photos.some(photo =>
        photo.km < this.currentPhoto.km));

    if (passagesBeforeCurrentPhoto.length) {
      return this.setPassage(sortPassagesByDistanceToKm(
        passagesBeforeCurrentPhoto, this.currentPhoto.km)[0].id);
    }

    // no more photo and no passages to switch
    return Promise.resolve(this.generateCurrentPosition(false, true));
  }

  public getCurrentPhoto(): Photo {
    this.throwIfNotInited();
    return this.currentPhoto;
  }

  public getCurrentPassage(): Passage {
    this.throwIfNotInited();
    return this.currentPassage;
  }

  public getAllPassages(): Passage[] {
    this.throwIfNotInited();
    return this.segment.passages;
  }

  public getSegment(): Segment {
    this.throwIfNotInited();
    return this.segment;
  }

  public getCurrentPosition(): CurrentPosition {
    this.throwIfNotInited();
    return this.generateCurrentPosition();
  }

  public setPassage(id: string, km?: number): Promise<CurrentPosition> {
    this.throwIfNotInited();

    const newCurrentPassage = this.segment.passages
      .find(passage => passage.id === id);

    if (!newCurrentPassage) {
      throw new Error(`The passage with id = ${id} not exists`);
    }

    const passageKm = (typeof km === 'number') ?
      km :
      this.currentPhoto.km;

    this.currentPhoto = getClosestPhotoByKm(newCurrentPassage.photos, passageKm);
    this.currentPassage = newCurrentPassage;

    this.loadNeighbourSegmentsIfNeeded();

    return Promise.resolve(this.generateCurrentPosition(true, false));
  }

  private throwIfNotInited() {
    if (!this.isInited) {
      throw new Error('RdviewService has not been initialized with road or coordinates before use');
    }
  }

  private loadNeighbourSegmentsIfNeeded() {
    if (!this.currentPhoto) {
      return;
    }

    if (this.segment.kmEnd - this.currentPhoto.km <
        this.distanceToBorderInKmToStartLoadingNewSegment &&
        !this.passageService.isNextSegmentEmpty) {
      this.passageService.loadNextSegment();
    }

    if (this.currentPhoto.km - this.segment.kmBegin <
        this.distanceToBorderInKmToStartLoadingNewSegment &&
        !this.passageService.isPreviousSegmentEmpty) {
      this.passageService.loadPreviousSegment();
    }
  }

  private generateCurrentPosition(isPassageChanged: boolean = false,
      isNoNewPhoto: boolean = false, isEmptyResult: boolean = false): CurrentPosition {
    return Object.assign({
      currentPassage: this.currentPassage,
      currentPhoto: this.currentPhoto,

      isPassageChanged,
      isNoNewPhoto,
      isEmptyResult
    }, this.segment);
  }
}
