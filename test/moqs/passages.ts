import { Passage, Direction, ViewType } from '../../src/interfaces';

export const passages: Passage[] = [
  {
    id: '1',
    date: new Date(50000),
    direction: Direction.Forward,
    views: [],
    viewType: ViewType.TwoDimensional,
    rdKmFrom: 150,
    rdKmTo: 160
  },
  {
    id: '2',
    date: new Date(150000),
    direction: Direction.Forward,
    views: [],
    viewType: ViewType.TwoDimensional,
    rdKmFrom: 30,
    rdKmTo: 40
  },
  {
    id: '3',
    date: new Date(70000),
    direction: Direction.Forward,
    views: [],
    viewType: ViewType.TwoDimensional,
    rdKmFrom: 70,
    rdKmTo: 80
  },
  {
    id: '4',
    date: new Date(2500000),
    direction: Direction.Forward,
    views: [],
    viewType: ViewType.TwoDimensional,
    rdKmFrom: 120,
    rdKmTo: 130
  }
];
