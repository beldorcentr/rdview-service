import { Passage, Photo, Segment } from './interfaces';
import { REQUEST_PASSAGE_DIRECTION, RoadSegmentService } from './road-segment-service';
import {
  dateParser, distanceBetweenCoords, getClosestPhotoByCoords,
  getClosestPhotoByKm, sortPassagesByDateDesc, sortPassagesByDistanceToKm, sortPhotosByKmAsc
} from './utils';

export class PassageService {

  public loadingPreviousSegment: Promise<void>;
  public isPreviousSegmentEmpty: boolean;

  public loadingNextSegment: Promise<void>;
  public isNextSegmentEmpty: boolean;

  private distanceToBorderInKmToStartLoadingNewSegment = .5;
  private dateDiffInMsForSamePassage = 1000 * 30;
  private rangeDiffInKmForSamePassage = .2;

  private roadSegmentService: RoadSegmentService;

  private segment: Segment;

  constructor(settings: { apiUrl?: string, authorization: string }) {
    this.roadSegmentService = new RoadSegmentService({
      apiUrl: settings.apiUrl,
      authorization: settings.authorization
    });
  }

  public initByRoad(roadId: number, km: number): Promise<Segment> {
    return this.roadSegmentService.getSegmentByRoad(roadId, km)
      .then(segment => this.initFirstSegment(segment));
  }

  public initByCoordinates(lat: number, lon: number): Promise<Segment> {
    return this.roadSegmentService.getSegmentByCoordinates(lat, lon)
      .then(segment => this.initFirstSegment(segment));
  }

  public getSegment(): Segment {
    return JSON.parse(JSON.stringify(this.segment), dateParser);
  }

  public loadNextSegment() {
    if (this.loadingNextSegment) {
      return;
    }
    this.loadingNextSegment = this.roadSegmentService
      .getSegmentByRoad(this.segment.roadId, this.segment.kmEnd,
        REQUEST_PASSAGE_DIRECTION.FORWARD)
      .then(segment => {
        // TODO: clear previous from X km back
        this.loadingNextSegment = null;
        if (this.isSegmentWithPassages(segment)) {
          this.includeSegment(segment);
        } else {
          this.isNextSegmentEmpty = true;
        }
      });
  }

  public loadPreviousSegment() {
    if (this.loadingPreviousSegment) {
      return;
    }
    this.loadingPreviousSegment = this.roadSegmentService
      .getSegmentByRoad(this.segment.roadId, this.segment.kmBegin,
        REQUEST_PASSAGE_DIRECTION.BACKWARD)
      .then(segment => {
        this.loadingPreviousSegment = null;
        if (this.isSegmentWithPassages(segment)) {
          this.includeSegment(segment);
        } else {
          this.isPreviousSegmentEmpty = true;
        }
      });
  }

  private initFirstSegment(segment: Segment): Segment {
    if (!segment) {
      return;
    }
    this.segment = segment;
    this.segment.passages = sortPassagesByDateDesc(this.segment.passages);
    this.segment.passages = this.getPassagesWithBorders(this.segment.passages);
    return segment;
  }

  private isSegmentWithPassages(segment: Segment): boolean {
    return segment != null &&
      Array.isArray(segment.passages) &&
      segment.passages.length > 0;
  }

  private includeSegment(segment: Segment) {
    if (!segment) {
      return;
    }

    this.segment.kmBegin = Math.min(this.segment.kmBegin,
      segment.kmBegin);
    this.segment.kmEnd = Math.max(this.segment.kmEnd,
      segment.kmEnd);

    segment.passages.forEach(newPassage => {
      const existingNeighbourPassage = this.segment.passages
        .find(existingPassage => {
          if (existingPassage.direction !== newPassage.direction) {
            return false;
          }

          if (!this.isPassagesNeighboursByKm(newPassage, existingPassage,
              this.rangeDiffInKmForSamePassage)) {
            return false;
          }

          return this.isPassagesNeighboursByDate(newPassage, existingPassage,
            this.dateDiffInMsForSamePassage);
        });

      if (existingNeighbourPassage) {
        existingNeighbourPassage.photos = sortPhotosByKmAsc(
          existingNeighbourPassage.photos.concat(newPassage.photos));
      } else {
        this.segment.passages.push(newPassage);
      }
    });

    this.segment.passages = sortPassagesByDateDesc(this.segment.passages);
    this.segment.passages = this.getPassagesWithBorders(this.segment.passages);
  }

  private isPassagesNeighboursByKm(passage1: Passage, passage2: Passage, maxKmDiff: number): boolean {
    const getPassagePhotoKmArray = (passage: Passage) => passage.photos.map(photo => photo.km);

    const passage1PhotoKmArray = getPassagePhotoKmArray(passage1);
    const passage2PhotoKmArray = getPassagePhotoKmArray(passage2);

    return this.inNumberArraysIntersects(passage1PhotoKmArray, passage2PhotoKmArray, maxKmDiff);
  }

  private isPassagesNeighboursByDate(passage1: Passage, passage2: Passage, maxMsDiff: number): boolean {
    const getPassagePhotoDateInMsArray = (passage: Passage) =>
      passage.photos.map(photo => photo.date.getTime());

    const passage1PhotoDateInMsArray = getPassagePhotoDateInMsArray(passage1);
    const passage2PhotoDateInMsArray = getPassagePhotoDateInMsArray(passage2);

    return this.inNumberArraysIntersects(passage1PhotoDateInMsArray,
      passage2PhotoDateInMsArray, maxMsDiff);
  }

  private inNumberArraysIntersects(array1: number[], array2: number[], precision: number) {
    const minValueInArray1 = Math.min.apply(null, array1);
    const minValueInArray2 = Math.min.apply(null, array2);

    const maxValueInArray1 = Math.max.apply(null, array1);
    const maxValueInArray2 = Math.max.apply(null, array2);

    const isValueBetween = (value, borderLeft, borderRight, prec) =>
      borderLeft - prec <= value && value <= borderRight + prec;

    return isValueBetween(minValueInArray1, minValueInArray2, maxValueInArray2, precision) ||
      isValueBetween(maxValueInArray1, minValueInArray2, maxValueInArray2, precision) ||
      isValueBetween(minValueInArray2, minValueInArray1, maxValueInArray1, precision) ||
      isValueBetween(maxValueInArray2, minValueInArray1, maxValueInArray1, precision);
  }

  private getPassagesWithBorders(passages: Passage[]): Passage[] {
    return passages.map(passage => {
      passage.kmBegin = Math.min.apply(null, passage.photos.map(photo => photo.km));
      passage.kmEnd = Math.max.apply(null, passage.photos.map(photo => photo.km));
      return passage;
    });
  }
}
