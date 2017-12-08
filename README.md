# Rdview service

Service for [rdview](https://i.centr.by/rdview) to receive photos from roads.

## Description

Serivice uses rdview api and provides photos from roads of Belarus. Required [authorization](https://i.centr.by/oauth/)

## Installation

```
npm install rdview-service
```

## Usage

```
// js
import { RdviewService } from 'rdview-service';

// ts
import { RdviewService, Passage, Photo, Road, Segment, CurrentPosition } from 'rdview-service';


const rdviewService = new RdviewService({
  // default: apiUrl: 'https://i.centr.by/rdview',
  authorization: 'Bearer YOUR_OAUTH_TOKEN'
});

rdviewService.initByCoordinates(50, 30)
  .then(currentPosition => handleNewPosition(currentPosition));

// moving
rdviewService.getNextPhoto()
  .then(currentPosition => handleNewPosition(currentPosition));

// change passage
rdviewService.setPassage(passageId)
  .then(currentPosition => handleNewPosition(currentPosition));

function handleNewPosition(position) {
  // position.roadName
  // position.currentPhoto.km
  // position.currentPhoto.lat
  // position.currentPhoto.lon
  // position.currentPhoto.imgUrl
}
```
