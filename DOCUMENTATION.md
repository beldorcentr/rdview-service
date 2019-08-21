## RdviewService

```
constructor({ apiUrl = 'https://i.centr.by/rdview/api',
    authorization = ''
  }: RdviewServiceConfig = { })
```

authorization: 'Bearer YOUR_OAUTH_TOKEN'


Before usage service must be inited by coordinates or road id and km:

```
initByRoad(idRd: number, km: number): Promise<CurrentPosition>
initByCoordinates(lat: number, lon: number): Promise<CurrentPosition>

// coordinates format - decimal degrees
rdviewService.initByCoordinates(52.34, 28.9)

// 30000001 = M1 E30
rdviewService.initByRoad(30000001, 150)
```

Resolved promise after initialization contains CurrentPosition on road.

When inited, current position can be changed by methods

```
getNextView(): Promise<CurrentPosition>
getPreviousView(): Promise<CurrentPosition>
setPassage(passageId, rdKm?): Promise<CurrentPosition>
```

Current position information can be fetched by methods:

```
getCurrentView(): View
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

#### View

```
export interface View {
  azimuth: number;
  date: Date;
  id: string;
  lat: number;
  lon: number;
  rdKm: number;
  imgUrl: string;
  viewType: ViewType;
}
```

#### ViewType

```
export enum ViewType {
  TwoDimensional = 'twoDimensional',
  EquirectangularPanorama = 'equirectangularPanorama'
}
```

#### Passage

```
export interface Passage {
  id: string;
  date: Date;
  direction: Direction;
  viewType: ViewType;
  views: View[];
  rdKmFrom: number;
  rdKmTo: number;
}
```

#### Direction

```
export enum Direction {
  Backward = 'backward',
  Forward = 'forward'
}
```

#### Segment

```
interface Segment {
  road: Road;
  rdKmFrom: number;
  rdKmTo: number;
  passages: Passage[];
}
```

#### CurrentPosition

```
export interface CurrentPosition extends Segment  {
  currentPassage?: Passage;
  currentView?: View;

  closeToCurrentRdKmFrom?: number;
  closeToCurrentRdKmTo?: number;
  closeToCurrentPassages?: Passage[];

  isPassageChanged?: boolean;
  isNoNewPhoto?: boolean;
  isEmptyResult: boolean;
}
```
