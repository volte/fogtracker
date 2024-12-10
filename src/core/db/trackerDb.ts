import Dexie, { type EntityTable } from 'dexie';
import { Area, Connection, Flag, FlagCategory, Port, Region } from '@/core/db/model';
import { TrackerState } from '@/core/game/trackerState';
import { createId } from '@paralleldrive/cuid2';

const createSchema = (fields: string[]) => ['&id', ...fields].join(', ');

export class TrackerDatabase extends Dexie {
  public regions!: EntityTable<Region, 'id'>;
  public flagCategories!: EntityTable<FlagCategory, 'id'>;
  public flags!: EntityTable<Flag, 'id'>;
  public ports!: EntityTable<Port, 'id'>;
  public connections!: EntityTable<Connection, 'id'>;
  public areas!: EntityTable<Area, 'id'>;

  constructor() {
    super('TrackerDatabase');

    const db = this;

    db.version(1).stores({
      config: createSchema(['key']),
      regions: createSchema(['name']),
      flagCategories: createSchema(['name']),
      flags: createSchema(['categoryId', 'name']),
      ports: createSchema(['areaId', 'name', 'direction']),
      connections: createSchema(['type', 'fromId', 'toId', 'isRevealed']),
      areas: createSchema(['name', 'regionId']),
    });

    db.regions.mapToClass(Region);
    db.flagCategories.mapToClass(FlagCategory);
    db.flags.mapToClass(Flag);
    db.ports.mapToClass(Port);
    db.connections.mapToClass(Connection);
    db.areas.mapToClass(Area);
  }

  async initFromState(state: TrackerState) {
    await this.delete();
    await this.open();
    await this.transaction(
      'rw',
      [this.regions, this.flagCategories, this.flags, this.ports, this.connections, this.areas],
      async () => {
        const flagCategories = Array.from(new Set(state.flags.map(flag => flag.category))).map(category => ({
          id: createId(),
          name: category,
        }));
        const flags = state.flags.map(flag => ({
          ...flag,
          categoryId: flagCategories.find(category => category.name === flag.category)?.id,
        }));
        const connections = state.connections.map(connection => ({
          ...(connection.type == 'inMap'
            ? { fromId: connection.fromAreaId, toId: connection.toAreaId }
            : { fromId: connection.fromPortId, toId: connection.toPortId }),
          type: connection.type,
          metadata: connection.metadata,
          id: createId(),
        }));
        const ports = state.ports.map(port => ({
          ...port,
          isRevealed: false,
        }));

        await this.regions.bulkPut(state.regions);
        await this.flagCategories.bulkPut(Array.from(flagCategories));
        await this.flags.bulkPut(flags);
        await this.ports.bulkPut(ports);
        await this.connections.bulkPut(connections);
        await this.areas.bulkPut(state.areas);
      }
    );
  }

  async importFromJson(json: string) {
    await this.delete();
    await this.open();
    await this.transaction(
      'rw',
      [this.regions, this.flagCategories, this.flags, this.ports, this.connections, this.areas],
      async () => {
        const data = JSON.parse(json);
        await this.regions.bulkPut(data.regions || []);
        await this.flagCategories.bulkPut(data.flagCategories || []);
        await this.flags.bulkPut(data.flags || []);
        await this.ports.bulkPut(data.ports || []);
        await this.connections.bulkPut(data.connections || []);
        await this.areas.bulkPut(data.areas || []);
      }
    );
  }

  exportToJson(): string {
    const regions = await this.regions.toArray();
    const flagCategories = await this.flagCategories.toArray();
    const flags = await this.flags.toArray();
    const ports = await this.ports.toArray();
    const connections = await this.connections.toArray();
    const areas = await this.areas.toArray();

    return JSON.stringify({
      regions,
      flagCategories,
      flags,
      ports,
      connections,
      areas,
    });
  }
}

export const db = new TrackerDatabase();
