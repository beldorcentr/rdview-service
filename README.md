# Rdview service

Service for [rdview](https://i.centr.by/rdview) to receive photos from roads.

## Description

Serivice uses rdview api and provides photos from roads of Belarus. Required [authorization](https://i.centr.by/oauth/)

Photo types - 2D and 3D equirectangular panoramas.

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
  RdviewService, Passage, View, Road, Segment, CurrentPosition
} from 'rdview-service';


const rdviewService = new RdviewService({
  // default: apiUrl: 'https://i.centr.by/rdview/api',
  authorization: 'Bearer YOUR_OAUTH_TOKEN'
});

rdviewService.initByCoordinates(52.34, 28.9)
  .then(currentPosition => handleNewPosition(currentPosition));

// moving
rdviewService.getNextView()
  .then(currentPosition => handleNewPosition(currentPosition));

// change passage
rdviewService.setPassage(passageId)
  .then(currentPosition => handleNewPosition(currentPosition));

function handleNewPosition(position) {
  // position.road.name
  // position.currentView.km
  // position.currentView.lat
  // position.currentView.lon
  // position.currentView.azimuth
  // position.currentView.date
  // position.currentView.imgUrl
  // position.currentView.viewType
  // position.passages[0].id
}
```

viewType: 'twoDimensional' or 'equirectangularPanorama'

Full documentation in [DOCUMENTATION.md](DOCUMENTATION.md)
