import { LineReader } from '@/utils/lineReader';

describe('lineReader', () => {
  describe('readLine', () => {
    it('reads lines', () => {
      const reader = new LineReader('foo\nbar\nbaz');
      expect(reader.readLine()).toBe('foo');
      expect(reader.readLine()).toBe('bar');
      expect(reader.readLine()).toBe('baz');
      expect(reader.readLine()).toBeUndefined();
    });
  });
});
