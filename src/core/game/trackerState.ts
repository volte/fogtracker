export type TrackerMetadata = Record<string, unknown>;

export interface TrackerArea {
  id: string;
  name: string;
  description: string;
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
  direction: 'in' | 'out' | 'inout';
  metadata?: TrackerMetadata;
}

export interface TrackerInMapConnection {
  type: 'inMap';
  fromAreaId: string;
  toAreaId: string;
  condition?: TrackerCondition;
  metadata?: TrackerMetadata;
}

export interface TrackerPortConnection {
  type: 'port';
  fromPortId: string;
  toPortId: string;
  metadata?: TrackerMetadata;
}

export type TrackerConnection = TrackerInMapConnection | TrackerPortConnection;

export interface TrackerState {
  isInitialized: boolean;
  flags: TrackerFlag[];
  areas: TrackerArea[];
  connections: TrackerConnection[];
  regions: TrackerRegion[];
  ports: TrackerPort[];
  metadata?: TrackerMetadata;
}
