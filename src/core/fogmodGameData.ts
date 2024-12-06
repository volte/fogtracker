import yaml from 'yaml';

type Option = {
  Opt?: string;
  TrueOpt?: string;
};

type AreaTransition = {
  Area: string;
  Tags?: string;
  Cond?: string;
};

interface Area {
  Name: string;
  Description: string;
  To?: AreaTransition[];
  Tags?: string;
  ScalingBase?: string;
}

interface KeyItem {
  Name: string;
  ID: string;
  Area: string;
  Tags?: string;
}

type WarpSide = {
  Area: string;
  Cutscene?: string;
  WarpFlag?: string;
  DestinationMap?: string;
  BeforeWarpFlag?: string;
  Cond?: string;
  Tags?: string;
};

interface Warp {
  ID: string;
  Area: string;
  Text: string;
  Tags?: string;
  ASide?: WarpSide;
  BSide?: WarpSide;
}

type EntranceSide = {
  Area: string;
  Flag?: string;
  BossTrigger?: string;
  BeforeWarpFlag?: string;
  CustomWarp?: string;
  CustomActionWidth?: number;
  DestinationMap?: string;
  Col?: string;
  ActionRegion?: string;
  Tags?: string;
};

interface Entrance {
  Name: string;
  ID: string;
  Area: string;
  Text: string;
  Tags?: string;
  DoorCond?: string;
  ASide: EntranceSide;
  BSide: EntranceSide;
}

type LotLocation = {
  [key: number]: string;
};

interface GameData {
  Options: Option[];
  Areas: Area[];
  KeyItems: KeyItem[];
  Warps: Warp[];
  Entrances: Entrance[];
  LotLocations: LotLocation;
  Regions?: Region[];
  FlagInfo?: { [key: string]: FlagInfo };
  AreaInfo?: { [key: string]: AreaInfo };
}

interface Region {
  ID: string;
  Name: string;
}

interface FlagInfo {
  Name: string;
  Category: string;
}

interface EntranceInfo {
  Name: string;
}

interface WarpInfo {
  Name: string;
}

interface AreaInfo {
  Name: string;
  RegionId: string;
  EntranceInfo?: Record<string, EntranceInfo>;
  WarpInfo?: Record<string, WarpInfo>;
}

export function parseFogModGameData(gameData: string): GameData {
  return yaml.parse(gameData) as GameData;
}
