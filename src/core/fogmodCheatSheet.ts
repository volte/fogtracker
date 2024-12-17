import { LineReader } from '@/utils/lineReader';

export interface Transitions {
  otherArea: string;
  otherEntrance: string;
  thisEntrance?: string;
  comment: string;
  fromKey?: string;
  toKey?: string;
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
  comment: string;
  fromKey?: string;
  toKey?: string;
}

export interface FogModCheatSheet {
  options: string[];
  connections: Connection[];
}

export function parseFogModCheatSheet(cheatSheet: string): FogModCheatSheet {
  const reader = new LineReader(cheatSheet, {
    filter: line => line.trim().length > 0,
  });

  const parseError = (message: string): never => {
    throw new Error(`FogMod cheat sheet error (line ${reader.lineNumber}): ${message}`);
  };

  const header = reader.readLine();
  if (!header?.startsWith('Seed:')) {
    throw new Error('Invalid FogMod cheat sheet; expected Seed');
  }
  const options = header.match(/Options: (.*)/)?.[1]?.split(' ') || [];
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
      const matches = line.match(/^ {2}From (\S+) \((.*?)\) to (\S+)(?: \((.*?)\))?(?:\s*\/\/ \[(.)] \[(.)])?/);
      if (!matches) {
        return parseError('invalid transition format');
      }
      currentArea.connections.push({
        otherArea: matches[1]!,
        thisEntrance: matches[4] || '',
        otherEntrance: matches[2]!,
        fromKey: matches[5] || '',
        toKey: matches[6] || '',
        comment: line.trim(),
      });
    } else {
      const matches = line.match(/^(\S+)/);
      if (!matches) {
        return parseError('invalid transition format');
      }
      currentArea = { areaName: matches[1]!, connections: [] };
      areas.push(currentArea);
    }
  }
  if (!finished) {
    return parseError('expected Finished');
  }

  const connections: Connection[] = [];
  for (const area of areas) {
    for (const connection of area.connections) {
      const toEntrance = connection.thisEntrance || connection.otherEntrance;
      connections.push({
        toArea: area.areaName,
        toEntrance,
        fromArea: connection.otherArea,
        fromEntrance: connection.otherEntrance,
        comment: connection.comment,
        fromKey: connection.fromKey,
        toKey: connection.toKey,
      });
    }
  }

  return { options, connections };
}
