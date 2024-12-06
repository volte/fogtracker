import { TrackerState } from '@/core/game/trackerState';

export interface InitializeTrackerStateOptions<GameData, CheatSheetData> {
  gameData: GameData;
  cheatSheetData: CheatSheetData;
}

export interface GameDefinition {
  name: string;
  initializeTrackerState: (
    options: InitializeTrackerStateOptions<never, never>
  ) => TrackerState | Promise<TrackerState>;
}
