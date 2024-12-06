export type TrackerMetadata = Record<string, unknown>;

export interface TrackerArea {
  id: string;
  name: string;
  regionId?: string;
  metadata?: TrackerMetadata;
}

export interface TrackerRegion {
  id: string;
  name: string;
  metadata?: TrackerMetadata;
}

export interface TrackerFlag {
  id: string;
  category: string;
  name: string;
  metadata?: TrackerMetadata;
}

export interface TrackerCondition {
  flagIds: string[];
  mode: 'and' | 'or';
  metadata?: TrackerMetadata;
}

export interface TrackerPort {
  id: string;
  areaId: string;
  name: string;
  exitOnly: boolean;
  metadata?: TrackerMetadata;
}

export interface TrackerInMapConnection {
  type: 'inMap';
  fromAreaId: string;
  toAreaId: string;
  revealed: true;
  condition?: TrackerCondition;
  metadata?: TrackerMetadata;
}

export interface TrackerPortConnection {
  type: 'port';
  fromPortId: string;
  toPortId: string;
  revealed: boolean;
  metadata?: TrackerMetadata;
}

export type TrackerConnection = TrackerInMapConnection | TrackerPortConnection;

export interface TrackerState {
  flags: TrackerFlag[];
  areas: TrackerArea[];
  connections: TrackerConnection[];
  regions: TrackerRegion[];
  ports: TrackerPort[];
  metadata?: TrackerMetadata;
}

export class Tracker {
  private _initTrackerState = () => {};
}
