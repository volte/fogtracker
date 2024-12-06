import fs from 'fs';
import { DarkSoulsGameDefinition } from '@/core/game/ds1/darkSouls';

describe('DarkSoulsGameDefinition', () => {
  describe('initializeTrackerState', () => {
    const gameData = fs.readFileSync('test/data/sampleDS1FogModGameData.yml').toString();
    const cheatSheetData = fs.readFileSync('test/data/sampleDS1FogModCheatSheet.txt').toString();
    const gameDefinition = new DarkSoulsGameDefinition();

    it('initializes the tracker state', async () => {
      const trackerState = await gameDefinition.initializeTrackerState({ gameData, cheatSheetData });
      expect(trackerState).toMatchSnapshot();
    });
  });
});