export interface Elevation {
  gain: number;
  loss: number;
  min: number;
  max: number;
  source: string;
  polyline: string;
}

export interface Waypoint {
  lat: number;
  lng: number;
}

export interface Route {
  name: string;
  elevation: Elevation;
  pointsOfInterest: any[];
  routePolyline: string;
  waypoints: Waypoint[];
  distance: number;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Value {
  format: string;
  value: number;
}

export interface ActivityInfo {
  key: string;
  value: Value;
}

export interface Location2 {
  lat: number;
  lng: number;
}

export interface ActivityStatus {
  id: string;
  route?: Route;
  riderName: string;
  createdAt: Date;
  updatedAt: Date;
  state: string;
  location: Location;
  bearing: number;
  activityInfo: ActivityInfo[];
  locations: Location2[];
}

