import * as Rx from 'rxjs';
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
  isExitOnly: boolean;
  metadata?: TrackerMetadata;
}

export interface TrackerInMapConnection {
  type: 'inMap';
  fromAreaId: string;
  toAreaId: string;
  isRevealed: true;
  condition?: TrackerCondition;
  metadata?: TrackerMetadata;
}

export interface TrackerPortConnection {
  type: 'port';
  fromPortId: string;
  toPortId: string;
  isRevealed: boolean;
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

export class Tracker {
  public static readonly emptyState: TrackerState = {
    isInitialized: false,
    flags: [],
    areas: [],
    connections: [],
    regions: [],
    ports: [],
  };

  private _trackerStateSubject: Rx.BehaviorSubject<TrackerState> = new Rx.BehaviorSubject<TrackerState>(
    Tracker.emptyState
  );

  constructor() {
    this.clear();
  }

  public get trackerState$() {
    return this._trackerStateSubject.asObservable();
  }

  public get trackerState() {
    return this._trackerStateSubject.value;
  }

  public clear() {
    this.setState(Tracker.emptyState);
  }

  public setState(trackerState: TrackerState) {
    this._trackerStateSubject.next(trackerState);
  }

  public revealPort(portId: string, revealed: boolean) {
    this._trackerStateSubject.next(
      produce(this._trackerStateSubject.value, draft => {
        const connections = draft.connections.filter(
          connection =>
            connection.type === 'port' && (connection.fromPortId === portId || connection.toPortId === portId)
        );
        console.log(connections);
        for (const connection of connections) {
          connection.isRevealed = revealed;
        }
      })
    );
  }
}
