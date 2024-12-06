import Dexie, { type EntityTable } from 'dexie';
import { Area, Condition, Connection, Flag, FlagCategory, Port, Region } from '@/core/db/model';

const createSchema = (fields: string[]) => ['&id', ...fields, 'metadata'].join(', ');

export class TrackerDatabase extends Dexie {
  public regions!: EntityTable<Region, 'id'>;
  public flagCategories!: EntityTable<FlagCategory, 'id'>;
  public flags!: EntityTable<Flag, 'id'>;
  public conditions!: EntityTable<Condition, 'id'>;
  public ports!: EntityTable<Port, 'id'>;
  public connections!: EntityTable<Connection, 'id'>;
  public areas!: EntityTable<Area, 'id'>;

  constructor() {
    super('TrackerDatabase');

    const db = this;

    db.version(1).stores({
      regions: createSchema(['name']),
      flagCategories: createSchema(['name']),
      flags: createSchema(['categoryId', 'name']),
      conditions: createSchema(['flagIds', 'mode']),
      ports: createSchema(['areaId', 'name', 'isExitOnly']),
      connections: createSchema(['type', 'fromId', 'toId', 'isRevealed']),
      areas: createSchema(['name', 'regionId']),
    });

    db.regions.mapToClass(Region);
    db.flagCategories.mapToClass(FlagCategory);
    db.flags.mapToClass(Flag);
    db.conditions.mapToClass(Condition);
    db.ports.mapToClass(Port);
    db.connections.mapToClass(Connection);
    db.areas.mapToClass(Area);
  }
}

export const db = new TrackerDatabase();
