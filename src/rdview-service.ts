import { CurrentPosition, Passage, Segment, View } from './interfaces';
import { PassageService } from './passage-service';
import {
  filterPassagesByDistanceToCoordinates, filterPassagesByDistanceToKm,
  getClosestViewByCoords, getClosestViewByKm, sortPassagesByDateDesc,
  sortPassagesByDistanceToKm
} from './utils';
import { sortPassagesByDistanceToCoordinates } from './utils/sorting';

export interface RdviewServiceConfig {
  apiUrl?: string;
  authorization?: string;
}

export class RdviewService {
  private passageService: PassageService;

  private isInited = false;

  private distanceToBorderInKmToStartLoadingNewSegment = .5;

  private rangeDiffInKmForClosePassagesInFindingClosest = .1;
  private rangeDiffInCoordinatesForClosePassagesInFindingClosest = .005;

  private rangeInKmForClosestPassages = 2;

  private currentView: View;
  private currentPassage: Passage;

  private get segment(): Segment {
    return this.passageService.getSegment();
  }

  private get currentViewIndex(): number {
    return this.currentPassage.views.indexOf(this.currentView);
  }

  constructor({ apiUrl = 'https://i.centr.by/rdview/api/v2.0',
      authorization = ''
    }: RdviewServiceConfig = { }) {

    this.passageService = new PassageService({
      apiUrl,
      authorization
    });
  }

  public initByRoad(idRd: number, km: number): Promise<CurrentPosition> {
    return this.passageService.initByRoad(idRd, km)
      .then(segment => {
        this.clearSettings();

        if (!segment) {
          return this.generateCurrentPosition(false, false, true);
        }

        this.isInited = true;

        const closePassagesToKm = filterPassagesByDistanceToKm(segment.passages,
          km, this.rangeDiffInKmForClosePassagesInFindingClosest);

        this.currentPassage = closePassagesToKm.length ?
          sortPassagesByDateDesc(closePassagesToKm)[0] :
          sortPassagesByDistanceToKm(segment.passages, km)[0];

        this.currentView = getClosestViewByKm(this.currentPassage.views, km);
        return this.generateCurrentPosition(true, false);
      });
  }

  public initByCoordinates(lat: number, lon: number): Promise<CurrentPosition> {
    return this.passageService.initByCoordinates(lat, lon)
      .then(segment => {
        this.clearSettings();

        if (!segment) {
          return this.generateCurrentPosition(false, false, true);
        }

        this.isInited = true;

        const closePassagesToCoordinates = filterPassagesByDistanceToCoordinates(
          segment.passages, lat, lon,
          this.rangeDiffInCoordinatesForClosePassagesInFindingClosest);

        this.currentPassage = closePassagesToCoordinates.length ?
          sortPassagesByDateDesc(closePassagesToCoordinates)[0] :
          sortPassagesByDistanceToCoordinates(segment.passages, lat, lon)[0];

        this.currentView = getClosestViewByCoords(this.currentPassage.views, lat, lon);
        return this.generateCurrentPosition(true, false);
      });
  }

  public getNextView(): Promise<CurrentPosition> {
    this.throwIfNotInited();

    this.loadNeighbourSegmentsIfNeeded();

    // has next photo in current passage
    if (this.currentViewIndex < this.currentPassage.views.length - 1) {
      this.currentView = this.currentPassage.views[this.currentViewIndex + 1];
      return Promise.resolve(this.generateCurrentPosition());
    }

    // case when loading segment
    if (this.passageService.loadingNextSegment) {
      return this.passageService.loadingNextSegment
        .then(() => this.getNextView());
    }

    // end of current passage
    const passagesAfterCurrentPhoto = this.segment.passages
      .filter(passage => passage.views.some(photo =>
        photo.rdKm > this.currentView.rdKm));

    if (passagesAfterCurrentPhoto.length) {
      return this.setPassage(sortPassagesByDateDesc(
        passagesAfterCurrentPhoto)[0].id);
    }

    // no more photo and no passages to switch
    return Promise.resolve(this.generateCurrentPosition(false, true));
  }

  public getPreviousView(): Promise<CurrentPosition> {
    this.throwIfNotInited();

    this.loadNeighbourSegmentsIfNeeded();

    // has previous photo in current passage
    if (this.currentViewIndex > 0) {
      this.currentView = this.currentPassage.views[this.currentViewIndex - 1];
      return Promise.resolve(this.generateCurrentPosition());
    }

    // case when loading segment
    if (this.passageService.loadingPreviousSegment) {
      return this.passageService.loadingPreviousSegment
        .then(() => this.getPreviousView());
    }

    // end of current passage
    const passagesBeforeCurrentPhoto = this.segment.passages
      .filter(passage => passage.views.some(photo =>
        photo.rdKm < this.currentView.rdKm));

    if (passagesBeforeCurrentPhoto.length) {
      return this.setPassage(sortPassagesByDateDesc(
        passagesBeforeCurrentPhoto)[0].id);
    }

    // no more photo and no passages to switch
    return Promise.resolve(this.generateCurrentPosition(false, true));
  }

  public getCurrentView(): View {
    this.throwIfNotInited();
    return this.currentView;
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

  public setPassage(id: string, rdKm?: number): Promise<CurrentPosition> {
    this.throwIfNotInited();

    const newCurrentPassage = this.segment.passages
      .find(passage => passage.id === id);

    if (!newCurrentPassage) {
      throw new Error(`The passage with id = ${id} not exists`);
    }

    const passageKm = (typeof rdKm === 'number') ?
      rdKm :
      this.currentView.rdKm;

    this.currentView = getClosestViewByKm(newCurrentPassage.views, passageKm);
    this.currentPassage = newCurrentPassage;

    this.loadNeighbourSegmentsIfNeeded();

    return Promise.resolve(this.generateCurrentPosition(true, false));
  }

  private throwIfNotInited() {
    if (!this.isInited) {
      throw new Error('RdviewService has not been initialized with road or coordinates before use');
    }
  }

  private clearSettings() {
    this.currentView = null;
    this.currentPassage = null;
    this.isInited = false;
    this.passageService.loadingPreviousSegment = null;
    this.passageService.loadingNextSegment = null;
    this.passageService.isNextSegmentEmpty = false;
    this.passageService.isPreviousSegmentEmpty = false;
  }

  private loadNeighbourSegmentsIfNeeded() {
    if (!this.currentView) {
      return;
    }

    if (this.segment.rdKmTo - this.currentView.rdKm <
        this.distanceToBorderInKmToStartLoadingNewSegment &&
        !this.passageService.isNextSegmentEmpty) {
      this.passageService.loadNextSegment();
    }

    if (this.currentView.rdKm - this.segment.rdKmFrom <
        this.distanceToBorderInKmToStartLoadingNewSegment &&
        !this.passageService.isPreviousSegmentEmpty) {
      this.passageService.loadPreviousSegment();
    }
  }

  private generateCurrentPosition(isPassageChanged: boolean = false,
      isNoNewPhoto: boolean = false, isEmptyResult: boolean = false): CurrentPosition {
    if (isEmptyResult) {
      return {
        isEmptyResult
      };
    }

    const closeToCurrentPassages = filterPassagesByDistanceToKm(this.segment.passages,
      this.currentView.rdKm, this.rangeInKmForClosestPassages);
    const closeToCurrentRdKmFrom = Math.max(this.segment.rdKmFrom,
      Math.max(0, this.currentView.rdKm - this.rangeInKmForClosestPassages));
    const closeToCurrentRdKmTo = Math.min(this.segment.rdKmTo,
      this.currentView.rdKm + this.rangeInKmForClosestPassages);

    closeToCurrentPassages.forEach(passage => {
      passage.rdKmFrom = Math.max(passage.rdKmFrom, closeToCurrentRdKmFrom);
      passage.rdKmTo = Math.min(passage.rdKmTo, closeToCurrentRdKmTo);
      passage.views = passage.views
        .filter(photo => passage.rdKmFrom < photo.rdKm && photo.rdKm < passage.rdKmTo);
      return passage;
    });

    return Object.assign({
      currentPassage: this.currentPassage,
      currentView: this.currentView,
      closeToCurrentRdKmFrom,
      closeToCurrentRdKmTo,
      closeToCurrentPassages,

      isPassageChanged,
      isNoNewPhoto,
      isEmptyResult
    }, this.segment);
  }
}
