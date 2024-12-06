import { TrackerState } from '@/core/tracker';

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
