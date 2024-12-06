import fs from 'fs';
import { parseFogModCheatSheet } from '@/core/parsers/fogmod';

describe('fogmod', () => {
  describe('parseFogModCheatSheet', () => {
    it('parses the cheat sheet', async () => {
      const sampleCheatSheetBuffer = (await fs.promises.readFile('test/data/sample_fogmod_cheatsheet.txt')).toString();
      const parsedCheatSheet = parseFogModCheatSheet(sampleCheatSheetBuffer);
      expect(parsedCheatSheet).toMatchSnapshot();
    });
  });
});
