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

export interface ActivityStatus {
    id: string;
    riderName: string;
    createdAt: Date;
    updatedAt: Date;
    state: string;
    location: Location;
    locations: Location[];
    bearing: number;
    activityInfo: ActivityInfo[];
}