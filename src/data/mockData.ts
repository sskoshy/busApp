import { BusLine, BusLocation } from '../types/bus';

export const busLines: BusLine[] = [
  {
    id: 'a-line',
    name: 'A Line',
    color: '#0066CC',
    pattern: 'solid',
    stops: [
      { id: 'a1', name: 'Memorial Union', latitude: 38.5415, longitude: -121.7489, order: 1 },
      { id: 'a2', name: 'Silo', latitude: 38.5423, longitude: -121.7501, order: 2 },
      { id: 'a3', name: 'Shields Library', latitude: 38.5407, longitude: -121.7512, order: 3 },
      { id: 'a4', name: 'ARC', latitude: 38.5389, longitude: -121.7543, order: 4 },
      { id: 'a5', name: 'Tercero', latitude: 38.5378, longitude: -121.7621, order: 5 },
    ]
  },
  {
    id: 'c-line',
    name: 'C Line',
    color: '#CC3333',
    pattern: 'dots',
    stops: [
      { id: 'c1', name: 'Downtown Terminal', latitude: 38.5449, longitude: -121.7405, order: 1 },
      { id: 'c2', name: '5th & G Street', latitude: 38.5442, longitude: -121.7421, order: 2 },
      { id: 'c3', name: 'Memorial Union', latitude: 38.5415, longitude: -121.7489, order: 3 },
      { id: 'c4', name: 'Cuarto', latitude: 38.5356, longitude: -121.7634, order: 4 },
    ]
  },
  {
    id: 'g-line',
    name: 'G Line',
    color: '#33AA33',
    pattern: 'stripes',
    stops: [
      { id: 'g1', name: 'Silo', latitude: 38.5423, longitude: -121.7501, order: 1 },
      { id: 'g2', name: 'Tercero', latitude: 38.5378, longitude: -121.7621, order: 2 },
      { id: 'g3', name: 'Cuarto', latitude: 38.5356, longitude: -121.7634, order: 3 },
      { id: 'g4', name: 'Orchard Park', latitude: 38.5334, longitude: -121.7589, order: 4 },
    ]
  },
  {
    id: 'm-line',
    name: 'M Line',
    color: '#CC6600',
    pattern: 'dots',
    stops: [
      { id: 'm1', name: 'Memorial Union', latitude: 38.5415, longitude: -121.7489, order: 1 },
      { id: 'm2', name: 'Segundo', latitude: 38.5401, longitude: -121.7578, order: 2 },
      { id: 'm3', name: 'Tercero', latitude: 38.5378, longitude: -121.7621, order: 3 },
      { id: 'm4', name: 'Cuarto', latitude: 38.5356, longitude: -121.7634, order: 4 },
      { id: 'm5', name: 'Downtown Terminal', latitude: 38.5449, longitude: -121.7405, order: 5 },
    ]
  },
  {
    id: 'p-line',
    name: 'P Line',
    color: '#9933CC',
    pattern: 'grid',
    stops: [
      { id: 'p1', name: 'Memorial Union', latitude: 38.5415, longitude: -121.7489, order: 1 },
      { id: 'p2', name: 'West Village', latitude: 38.5445, longitude: -121.7623, order: 2 },
      { id: 'p3', name: 'Solano Park', latitude: 38.5512, longitude: -121.7701, order: 3 },
    ]
  },
  {
    id: 'q-line',
    name: 'Q Line',
    color: '#FF9933',
    pattern: 'waves',
    stops: [
      { id: 'q1', name: 'Downtown Terminal', latitude: 38.5449, longitude: -121.7405, order: 1 },
      { id: 'q2', name: 'Silo', latitude: 38.5423, longitude: -121.7501, order: 2 },
      { id: 'q3', name: 'ARC', latitude: 38.5389, longitude: -121.7543, order: 3 },
      { id: 'q4', name: 'Segundo', latitude: 38.5401, longitude: -121.7578, order: 4 },
    ]
  },
  {
    id: 'w-line',
    name: 'W Line',
    color: '#0099CC',
    pattern: 'grid',
    stops: [
      { id: 'w1', name: 'West Village', latitude: 38.5445, longitude: -121.7623, order: 1 },
      { id: 'w2', name: 'Silo', latitude: 38.5423, longitude: -121.7501, order: 2 },
      { id: 'w3', name: 'Shields Library', latitude: 38.5407, longitude: -121.7512, order: 3 },
      { id: 'w4', name: 'ARC', latitude: 38.5389, longitude: -121.7543, order: 4 },
      { id: 'w5', name: 'Segundo', latitude: 38.5401, longitude: -121.7578, order: 5 },
    ]
  },
];

export const mockBusLocations: BusLocation[] = [
  {
    busId: 'bus-a1',
    lineId: 'a-line',
    currentStopIndex: 2,
    latitude: 38.5410,
    longitude: -121.7505,
    nextStopETA: 3,
    timestamp: new Date(),
    isDelayed: false,
    delayMinutes: 0,
    capacityPercent: 45,
  },
  {
    busId: 'bus-c1',
    lineId: 'c-line',
    currentStopIndex: 1,
    latitude: 38.5445,
    longitude: -121.7415,
    nextStopETA: 5,
    timestamp: new Date(),
    isDelayed: true,
    delayMinutes: 3,
    capacityPercent: 85,
  },
  {
    busId: 'bus-g1',
    lineId: 'g-line',
    currentStopIndex: 0,
    latitude: 38.5423,
    longitude: -121.7501,
    nextStopETA: 2,
    timestamp: new Date(),
    isDelayed: false,
    delayMinutes: 0,
    capacityPercent: 30,
  },
  {
    busId: 'bus-m1',
    lineId: 'm-line',
    currentStopIndex: 3,
    latitude: 38.5360,
    longitude: -121.7625,
    nextStopETA: 4,
    timestamp: new Date(),
    isDelayed: false,
    delayMinutes: 0,
    capacityPercent: 60,
  },
  {
    busId: 'bus-w1',
    lineId: 'w-line',
    currentStopIndex: 1,
    latitude: 38.5430,
    longitude: -121.7510,
    nextStopETA: 6,
    timestamp: new Date(),
    isDelayed: false,
    delayMinutes: 0,
    capacityPercent: 40,
  },
];