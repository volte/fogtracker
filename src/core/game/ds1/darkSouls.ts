import { InitializeTrackerStateOptions } from '@/core/game/gameDefinition';
import { parseFogModCheatSheet } from '@/core/fogmodCheatSheet';
import { parseFogModGameData } from '@/core/fogmodGameData';

import { TrackerArea, TrackerConnection, TrackerPort, TrackerFlag, TrackerState } from '@/core/game/trackerState';

const parseConditionString = (conditionString?: string): { flagIds: string[]; mode: 'and' | 'or' } | undefined => {
  if (!conditionString) {
    return undefined;
  }
  const flags = conditionString.split(' ');
  if (['OR', 'AND'].includes(flags[0]!)) {
    return {
      flagIds: flags.slice(1),
      mode: flags[0]!.toLowerCase() as 'and' | 'or',
    };
  }
  return {
    flagIds: flags,
    mode: 'and',
  };
};

export const darkSoulsGameDefinition = {
  name: 'Dark Souls',
  initializeTrackerState: async (options: InitializeTrackerStateOptions<string, string>): Promise<TrackerState> => {
    const gameData = parseFogModGameData(options.gameData);
    const cheatSheetData = parseFogModCheatSheet(options.cheatSheetData);

    const areas: TrackerArea[] = [];
    const flags: TrackerFlag[] = [];
    const connections: TrackerConnection[] = [];
    const ports: TrackerPort[] = [];

    const portNameToIdMap = new Map<string, string>();
    const getPortNameKey = ({ areaName, entrance, index }: { areaName: string; entrance: string; index: number }) =>
      `${areaName}:${entrance}:${index}`;
    const getPort = (key: string) => {
      const portId = portNameToIdMap.get(key);
      if (!portId) {
        console.log('Could not find port id for key:', key);
        return null;
      }
      const port = ports.find(port => port.id === portId);
      if (!port) {
        console.log('Could not find port for key:', key);
        return null;
      }
      return port;
    };

    const checkIfRandomized = (entranceName: string) => {
      const entrance = gameData.Entrances.find(entrance => entrance.Name === entranceName);
      if (!entrance) {
        return false;
      }
      const tags = entrance.Tags?.split(' ') || [];
      return tags.some(tag => cheatSheetData.options.includes(tag));
    };

    const regions =
      gameData.Regions?.map(region => ({
        id: region.ID,
        name: region.Name,
      })) || [];

    for (const flag of gameData.Options) {
      const flagId = flag.Opt || flag.TrueOpt;
      if (flagId) {
        const flagInfo = gameData.FlagInfo?.[flagId];
        const name = flagInfo?.Name || flagId;
        const category = flagInfo?.Category || 'Unknown';
        flags.push({
          id: flagId,
          name,
          category,
        });
      }
    }

    for (const area of gameData.Areas) {
      const areaInfo = gameData.AreaInfo?.[area.Name];
      for (const areaTo of area.To || []) {
        const tags = area.Tags?.split(' ') || [];
        connections.push({
          fromAreaId: area.Name,
          toAreaId: areaTo.Area,
          condition: parseConditionString(areaTo.Cond),
          type: 'inMap',
        });
        if (!tags.includes('drop')) {
          connections.push({
            fromAreaId: areaTo.Area,
            toAreaId: area.Name,
            condition: parseConditionString(areaTo.Cond),
            type: 'inMap',
          });
        }
      }
      areas.push({
        id: area.Name,
        name: areaInfo?.Name || area.Name,
        description: area.Description,
        regionId: areaInfo?.RegionId,
      });
    }

    for (const entrance of gameData.Entrances || []) {
      const aSideAreaInfo = gameData.AreaInfo?.[entrance.ASide.Area];
      const bSideAreaInfo = gameData.AreaInfo?.[entrance.BSide.Area];
      const tags = entrance.Tags?.split(' ') || [];
      if (!tags.every(tag => cheatSheetData.options.includes(tag))) {
        continue;
      }
      if (!entrance.ASide || !entrance.BSide) {
        continue;
      }
      if (entrance.ASide.ExcludeIfRandomized && checkIfRandomized(entrance.ASide.ExcludeIfRandomized)) {
        continue;
      }
      if (entrance.BSide.ExcludeIfRandomized && checkIfRandomized(entrance.BSide.ExcludeIfRandomized)) {
        continue;
      }
      const needsABDisambiguation = entrance.ASide.Area === entrance.BSide.Area;

      const aSideText = aSideAreaInfo?.EntranceInfo?.[entrance.ID]?.Name || entrance.Text;
      const bSideText = bSideAreaInfo?.EntranceInfo?.[entrance.ID]?.Name || entrance.Text;

      if (aSideText) {
        ports.push({
          id: `${entrance.ID}_A`,
          entranceId: entrance.ID,
          areaId: entrance.ASide.Area,
          name: aSideText + (needsABDisambiguation ? ' (A)' : ''),
          index: 0,
          direction: 'inout',
        });
        portNameToIdMap.set(
          getPortNameKey({ areaName: entrance.ASide.Area, entrance: entrance.Text, index: 0 }),
          `${entrance.ID}_A`
        );
      }

      if (bSideText) {
        ports.push({
          id: `${entrance.ID}_B`,
          entranceId: entrance.ID,
          areaId: entrance.BSide.Area,
          name: bSideText + (needsABDisambiguation ? ' (B)' : ''),
          index: 1,
          direction: 'inout',
        });
        portNameToIdMap.set(
          getPortNameKey({ areaName: entrance.BSide.Area, entrance: entrance.Text, index: 1 }),
          `${entrance.ID}_B`
        );
      }
    }

    for (const warp of gameData.Warps || []) {
      if (!warp.ASide || !warp.BSide) {
        continue;
      }
      const aSideAreaInfo = gameData.AreaInfo?.[warp.ASide.Area];
      const bSideAreaInfo = gameData.AreaInfo?.[warp.BSide.Area];
      ports.push({
        id: `${warp.ID}_A`,
        entranceId: warp.ID,
        areaId: warp.ASide.Area,
        name: aSideAreaInfo?.WarpInfo?.[warp.ID]?.Name || warp.Text,
        index: 0,
        direction: 'in',
      });
      ports.push({
        id: `${warp.ID}_B`,
        entranceId: warp.ID,
        areaId: warp.BSide.Area,
        name: bSideAreaInfo?.WarpInfo?.[warp.ID]?.Name || warp.Text,
        index: 1,
        direction: 'out',
      });
      portNameToIdMap.set(getPortNameKey({ areaName: warp.ASide.Area, entrance: warp.Text, index: 0 }), `${warp.ID}_A`);
      portNameToIdMap.set(getPortNameKey({ areaName: warp.BSide.Area, entrance: warp.Text, index: 1 }), `${warp.ID}_B`);
    }

    // Include entrance data from cheat sheet
    for (const connection of cheatSheetData.connections) {
      if (connection.toEntrance === 'in map') {
        continue;
      }

      const fromIndex = connection.fromKey === 'B' ? 1 : 0;
      const toIndex = connection.toKey === 'A' ? 0 : 1;

      const fromPort = getPort(
        getPortNameKey({ areaName: connection.fromArea, entrance: connection.fromEntrance, index: fromIndex })
      );
      const toPort = getPort(
        getPortNameKey({ areaName: connection.toArea, entrance: connection.toEntrance, index: toIndex })
      );

      if (!fromPort || !toPort) {
        continue;
      }

      connections.push({
        fromPortId: fromPort.id,
        toPortId: toPort.id,
        type: 'port',
        metadata: {
          comment: connection.comment,
        },
      });
      if (toPort.direction.includes('out')) {
        connections.push({
          fromPortId: toPort.id,
          toPortId: fromPort.id,
          type: 'port',
          metadata: {
            comment: connection.comment,
          },
        });
      }
    }

    return {
      isInitialized: true,
      flags,
      regions,
      areas,
      connections,
      ports,
    };
  },
};
