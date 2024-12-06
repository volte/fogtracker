import { LineReader } from '@/utils/lineReader';

export interface Connection {
  nextArea: string;
  thisTransition: string;
  otherTransition: string;
}

export interface Area {
  areaName: string;
  connections: Connection[];
}

export interface FogModCheatSheet {
  areas: Area[];
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

  const result: FogModCheatSheet = {
    areas: [],
  };
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
        nextArea: matches[1],
        thisTransition: matches[4],
        otherTransition: matches[2],
      });
    } else {
      const matches = line.match(/^(\S+)/);
      if (!matches) {
        return parseError('invalid transition format');
      }
      currentArea = { areaName: matches[1], connections: [] };
      result.areas.push(currentArea);
    }
  }
  if (!finished) {
    return parseError('expected Finished');
  }

  return result;
}
