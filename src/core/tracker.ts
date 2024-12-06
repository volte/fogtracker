import Rx from 'rxjs';
import { produce } from 'immer';

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
  private _trackerStateSubject: Rx.BehaviorSubject<TrackerState>;

  constructor(trackerState: TrackerState) {
    this._trackerStateSubject = new Rx.BehaviorSubject<TrackerState>(trackerState);
  }

  public get trackerState$() {
    return this._trackerStateSubject.asObservable();
  }

  public revealPort(portId: string, revealed: boolean) {
    this._trackerStateSubject.next(
      produce(this._trackerStateSubject.value, draft => {
        const connections = draft.connections.filter(
          connection =>
            connection.type === 'port' && (connection.fromPortId === portId || connection.toPortId === portId)
        );
        for (const connection of connections) {
          connection.revealed = revealed;
        }
      })
    );
  }
}
