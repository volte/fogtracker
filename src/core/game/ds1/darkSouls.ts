import { InitializeTrackerStateOptions } from '@/core/game/gameDefinition';
import { parseFogModCheatSheet } from '@/core/fogmodCheatSheet';
import { parseFogModGameData } from '@/core/fogmodGameData';

import { TrackerArea, TrackerConnection, TrackerPort, TrackerFlag, TrackerState } from '@/core/tracker';

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
    const getPortNameKey = ({ areaName, entrance }: { areaName: string; entrance: string }) =>
      `${areaName}:${entrance}`;

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
          isRevealed: true,
          condition: parseConditionString(areaTo.Cond),
          type: 'inMap',
        });
        if (!tags.includes('drop')) {
          connections.push({
            fromAreaId: areaTo.Area,
            toAreaId: area.Name,
            isRevealed: true,
            condition: parseConditionString(areaTo.Cond),
            type: 'inMap',
          });
        }
      }
      areas.push({
        id: area.Name,
        name: areaInfo?.Name || area.Name,
        regionId: areaInfo?.RegionId,
      });
    }

    for (const entrance of gameData.Entrances || []) {
      const aSideAreaInfo = gameData.AreaInfo?.[entrance.ASide.Area];
      const bSideAreaInfo = gameData.AreaInfo?.[entrance.BSide.Area];
      if (!entrance.ASide || !entrance.BSide) {
        continue;
      }
      ports.push({
        id: `${entrance.ID}_A`,
        areaId: entrance.ASide.Area,
        name: aSideAreaInfo?.EntranceInfo?.[entrance.ID]?.Name || entrance.Text,
        isExitOnly: false,
      });
      ports.push({
        id: `${entrance.ID}_B`,
        areaId: entrance.BSide.Area,
        name: bSideAreaInfo?.EntranceInfo?.[entrance.ID]?.Name || entrance.Text,
        isExitOnly: false,
      });
      portNameToIdMap.set(
        getPortNameKey({ areaName: entrance.ASide.Area, entrance: entrance.Text }),
        `${entrance.ID}_A`
      );
      portNameToIdMap.set(
        getPortNameKey({ areaName: entrance.BSide.Area, entrance: entrance.Text }),
        `${entrance.ID}_B`
      );
    }

    for (const warp of gameData.Warps || []) {
      if (!warp.ASide || !warp.BSide) {
        continue;
      }
      const aSideAreaInfo = gameData.AreaInfo?.[warp.ASide.Area];
      const bSideAreaInfo = gameData.AreaInfo?.[warp.BSide.Area];
      ports.push({
        id: `${warp.ID}_A`,
        areaId: warp.ASide.Area,
        name: aSideAreaInfo?.WarpInfo?.[warp.ID]?.Name || warp.Text,
        isExitOnly: false,
      });
      ports.push({
        id: `${warp.ID}_B`,
        areaId: warp.BSide.Area,
        name: bSideAreaInfo?.WarpInfo?.[warp.ID]?.Name || warp.Text,
        isExitOnly: true,
      });
      portNameToIdMap.set(getPortNameKey({ areaName: warp.ASide.Area, entrance: warp.Text }), `${warp.ID}_A`);
      portNameToIdMap.set(getPortNameKey({ areaName: warp.BSide.Area, entrance: warp.Text }), `${warp.ID}_B`);
    }

    // Include entrance data from cheat sheet
    for (const connection of cheatSheetData.connections) {
      const fromPortId = portNameToIdMap.get(
        getPortNameKey({ areaName: connection.fromArea, entrance: connection.fromEntrance })
      );
      const toPortId = portNameToIdMap.get(
        getPortNameKey({ areaName: connection.toArea, entrance: connection.toEntrance })
      );

      if (!fromPortId || !toPortId) {
        console.warn('Could not find port for connection:', connection.originalLine);
        continue;
      }

      const fromPort = ports.find(port => port.id === fromPortId);
      const toPort = ports.find(port => port.id === toPortId);

      if (!fromPort || !toPort) {
        console.warn('Could not find port for connection:', connection.originalLine);
        continue;
      }

      connections.push({
        fromPortId,
        toPortId,
        isRevealed: false,
        type: 'port',
        metadata: {
          comment: connection.originalLine,
        },
      });
      if (!toPort.isExitOnly) {
        connections.push({
          fromPortId: toPortId,
          toPortId: fromPortId,
          isRevealed: false,
          type: 'port',
          metadata: {
            comment: connection.originalLine,
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
