import { LineReader } from '@/utils/lineReader';

export interface Transitions {
  otherArea: string;
  otherEntrance: string;
  thisEntrance?: string;
  originalLine: string;
}

export interface Area {
  areaName: string;
  connections: Transitions[];
}

export interface Connection {
  fromArea: string;
  fromEntrance: string;
  toArea: string;
  toEntrance: string;
  originalLine: string;
}

export interface FogModCheatSheet {
  connections: Connection[];
}

export function parseFogModCheatSheet(cheatSheet: string): FogModCheatSheet {
  const reader = new LineReader(cheatSheet, {
    filter: line => line.trim().length > 0,
  });

  const parseError = (message: string): never => {
    throw new Error(`FogMod cheat sheet error (line ${reader.lineNumber}): ${message}`);
  };

  if (!reader.readLine().startsWith('Seed:')) {
    throw new Error('Invalid FogMod cheat sheet; expected Seed');
  }
  reader.skipLines(2);

  const areas: Area[] = [];
  let line: string | undefined;
  let currentArea: Area | undefined = undefined;
  let finished: boolean = false;

  while ((line = reader.readLine())) {
    if (line.startsWith('Finished')) {
      finished = true;
      break;
    }
    if (line.startsWith('  ')) {
      if (!currentArea) {
        return parseError('transition outside area');
      }
      const matches = line.match(/^ {2}From (\S+) \((.*?)\) to (\S+)(?: \((.*?)\))?/);
      if (!matches) {
        return parseError('invalid transition format');
      }
      currentArea.connections.push({
        otherArea: matches[1],
        thisEntrance: matches[4],
        otherEntrance: matches[2],
        originalLine: line.trim(),
      });
    } else {
      const matches = line.match(/^(\S+)/);
      if (!matches) {
        return parseError('invalid transition format');
      }
      currentArea = { areaName: matches[1], connections: [] };
      areas.push(currentArea);
    }
  }
  if (!finished) {
    return parseError('expected Finished');
  }

  const connections: Connection[] = [];
  for (const area of areas) {
    for (const connection of area.connections) {
      // Don't bother with non-entrance connections, they aren't randomized
      if (!connection.thisEntrance) {
        continue;
      }
      connections.push({
        toArea: area.areaName,
        toEntrance: connection.thisEntrance,
        fromArea: connection.otherArea,
        fromEntrance: connection.otherEntrance,
        originalLine: connection.originalLine,
      });
    }
  }

  return { connections };
}
