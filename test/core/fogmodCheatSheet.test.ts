import fs from 'fs';
import { parseFogModCheatSheet } from '@/core/fogmodCheatSheet';

describe('fogmodCheatSheet', () => {
  describe('parseFogModCheatSheet', () => {
    it('parses the cheat sheet', () => {
      const sampleCheatSheetBuffer = fs.readFileSync('test/data/sampleDS1FogModCheatSheet.txt').toString();
      const parsedCheatSheet = parseFogModCheatSheet(sampleCheatSheetBuffer);
      expect(parsedCheatSheet).toMatchSnapshot();
    });
  });
});
