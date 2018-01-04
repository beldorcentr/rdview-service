# Rdview service

Service for [rdview](https://i.centr.by/rdview) to receive photos from roads.

## Description

Serivice uses rdview api and provides photos from roads of Belarus. Required [authorization](https://i.centr.by/oauth/)

[Usage example](https://github.com/beldorcentr/rdview-front)

## Installation

```
npm install rdview-service
```

## Usage

```
// js
import { RdviewService } from 'rdview-service';

// ts
import {
  RdviewService, Passage, Photo, Road, Segment, CurrentPosition
} from 'rdview-service';


const rdviewService = new RdviewService({
  // default: apiUrl: 'https://i.centr.by/rdview/api',
  authorization: 'Bearer YOUR_OAUTH_TOKEN'
});

rdviewService.initByCoordinates(52.34, 28.9)
  .then(currentPosition => handleNewPosition(currentPosition));

// moving
rdviewService.getNextPhoto()
  .then(currentPosition => handleNewPosition(currentPosition));

// change passage
rdviewService.setPassage(passageId)
  .then(currentPosition => handleNewPosition(currentPosition));

function handleNewPosition(position) {
  // position.road.name
  // position.currentPhoto.km
  // position.currentPhoto.lat
  // position.currentPhoto.lon
  // position.currentPhoto.azimuth
  // position.currentPhoto.date
  // position.currentPhoto.imgUrl
  // position.passages[0].id
}
```

Full documentation in [DOCUMENTATION.md](DOCUMENTATION.md)
