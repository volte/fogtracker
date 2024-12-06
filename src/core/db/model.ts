import { Entity } from 'dexie';
import { TrackerDatabase } from '@/core/db/trackerDb';

export abstract class BaseEntity extends Entity<TrackerDatabase> {
  id!: string;
  metadata?: Record<string, unknown>;
}

export class Region extends BaseEntity {
  name!: string;
}

export class FlagCategory extends BaseEntity {
  name!: string;
}

export class Flag extends BaseEntity {
  categoryId?: string;
  name!: string;
}

export class Port extends BaseEntity {
  areaId!: string;
  name!: string;
  direction!: 'in' | 'out' | 'inout';
  isRevealed!: boolean;
}

export class Connection extends BaseEntity {
  type!: 'inMap' | 'port';
  fromId!: string;
  toId!: string;
}

export class Area extends BaseEntity {
  name!: string;
  description?: string;
  regionId?: string;
}
