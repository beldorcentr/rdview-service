## RdviewService

```
constructor({ apiUrl = 'https://i.centr.by/rdview/api',
    authorization = ''
  }: RdviewServiceConfig = { })
```

authorization: 'Bearer YOUR_OAUTH_TOKEN'


Before usage service must be inited by coordinates or road id and km:

```
initByRoad(roadId: number, km: number): Promise<CurrentPosition>
initByCoordinates(lat: number, lon: number): Promise<CurrentPosition>

// coordinates format - decimal degrees
rdviewService.initByCoordinates(52.34, 28.9)

// 30000001 = M1 E30
rdviewService.initByRoad(30000001, 150)
```

Resolved promise after initialization contains CurrentPosition on road.

When inited, current position can be changed by methods

```
getNextPhoto(): Promise<CurrentPosition>
getPreviousPhoto(): Promise<CurrentPosition>
setPassage(passageId, km?): Promise<CurrentPosition>
```

Current position information can be fetched by methods:

```
getCurrentPhoto(): Photo
getCurrentPassage(): Passage
getAllPassages(): Passage[]
getSegment(): Segment
getCurrentPosition(): CurrentPosition
```

## RoadService

```
constructor({ apiUrl = 'https://i.centr.by/rdview/api',
    authorization = ''
  }: RoadServiceConfig = { }) {
```

authorization: 'Bearer YOUR_OAUTH_TOKEN'

Search roads by name:

```
getRoads(search: string): Promise<Road[]>
```

## Interfaces

#### Road

```
interface Road {
  id: number; //30000001
  name: string; //М-1 Е30 Брест (Козловичи)-Минск-граница Российской Федерации (Редьки)
  code: string; //М-1 Е30
  title: string; //Брест (Козловичи)-Минск-граница Российской Федерации (Редьки)
}
```


#### Photo

```
export interface Photo {
  azimuth: number;
  date: Date;
  id: string;
  lat: number;
  lon: number;
  km: number;
  imgUrl: string;
}
```

#### Passage

```
interface Passage {
  id: string;
  date: Date;
  direction: 'forward' | 'backward';
  photos: Photo[];
  beginKm: number;
  endKm: number;
}
```

#### Segment

```
interface Segment {
  road: Road;
  beginKm: number;
  endKm: number;
  passages: Passage[];
}
```

#### CurrentPosition

```
interface CurrentPosition extends Segment  {
  currentPassage: Passage;
  currentPhoto: Photo;

  closeToCurrentBeginKm: number;
  closeToCurrentEndKm: number;
  closeToCurrentPassages: Passage[];

  isPassageChanged: boolean;
  isNoNewPhoto: boolean;
  isEmptyResult: boolean;
}
```
